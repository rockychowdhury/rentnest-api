import { IPaymentInitiatePayload } from "./payment.interface";
import { IQuery } from "../../types";
import { prisma } from "../../lib/prisma";
import { LeaseStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { PaymentSelect, PaymentWhereInput } from "../../../generated/prisma/models";
import { calculatePagination } from "../../utils/calculatePagination";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import Stripe from "stripe";

const paymentSelect: PaymentSelect = {
    id: true,
    leaseId: true,
    tenantId: true,
    landlordId: true,
    amount: true,
    currency: true,
    status: true,
    checkoutSessionId: true,
    transactionId: true,
    failureReason: true,
    paidAt: true,
    createdAt: true,
    updatedAt: true,
    lease: {
        select: {
            id: true,
            status: true,
            landlordId: true,
            propertyUnit: {
                select: {
                    id: true,
                    unitLabel: true,
                    property: {
                        select: {
                            id: true,
                            title: true,
                        }
                    }
                }
            }
        }
    },
    payer: {
        select: {
            id: true,
            profile: { select: { fullName: true } }
        }
    }
};

const initiatePayment = async (leaseId: string, tenantId: string) => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const user = await tx.user.findUniqueOrThrow({ where: { id: tenantId } });
            const lease = await tx.lease.findFirstOrThrow({
                where: {
                    id: leaseId,
                    tenantId: user.id,
                },
            });

            if (lease.status !== LeaseStatus.PENDING_PAYMENT) {
                throw new Error("Not a valid lease to pay")
            }

            let customerId = user.stripeCustomerId;
            if (!customerId) {
                const customer = await stripe.customers.create(
                    {
                        email: user.email,
                        phone: user.phone,
                        metadata: {
                            userId: user.id,
                        }
                    }
                );
                customerId = customer.id;
                await tx.user.update(
                    {
                        where: { id: user.id },
                        data: {
                            stripeCustomerId: customer.id
                        }
                    }
                );
            }

            const paymentPayload: IPaymentInitiatePayload = {
                leaseId: lease.id,
                tenantId: user.id,
                landlordId: lease.landlordId,
                amount: Number(lease.agreedAmount),
                currency: lease.currency,
                stripeCustomerId: customerId,
            }

            const payment = await tx.payment.create(
                {
                    data: paymentPayload,
                    select: {
                        id: true,
                        checkoutSessionId: true,
                        amount: true,
                        currency: true,
                        stripeCustomerId: true,
                        status: true
                    }
                }
            );

            const productKey = config.stripe_product_key;
            const session = await stripe.checkout.sessions.create(
                {
                    line_items: [
                        {
                            price_data: {
                                currency: payment.currency,
                                unit_amount: Number(payment.amount),
                                product: productKey
                            },
                            quantity: 1,
                        }
                    ],
                    mode: "payment",
                    invoice_creation: {
                        enabled: true,
                    },
                    customer: customerId,
                    payment_method_types: ["card"],
                    success_url: `${config.app_url}/payment/checkout?success=true`,
                    cancel_url: `${config.app_url}/payment/checkout?success=false`,
                    metadata: {
                        tenantId: user.id,
                        leaseId: lease.id,
                        paymentId: payment.id,
                    }
                }
            );
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    checkoutSessionId: session.id
                }
            });

            return session.url;
        });

    return { paymentUrl: transactionResult };

};

const handlePaymentSuccess = async (session: Stripe.Checkout.Session) => {
    const sessionId = session.id;
    const transactionId = session.payment_intent;
    // const { leaseId, paymentId, tenantId } = session.metadata as any
    const result = prisma.$transaction(
        async (tx) => {
            const payment = await prisma.payment.findUniqueOrThrow({
                where: {
                    checkoutSessionId: sessionId
                }
            });
            if (payment.status === PaymentStatus.COMPLETED) return;
            const updatedPayment = await prisma.payment.update({
                where: {
                    id: payment.id,
                    checkoutSessionId: session.id
                },
                data: {
                    status: PaymentStatus.COMPLETED,
                    paidAt: new Date(),
                    transactionId: transactionId as string
                }
            });
            const updatedLease = await prisma.lease.update({
                where: { id: payment.leaseId as string },
                data: {
                    status: LeaseStatus.ACTIVE,
                }
            });
            return { lease: updatedLease, payment: updatedPayment };
        }
    )


}

const handleSessionExpired = async (session: Stripe.Checkout.Session) => {
    const sid = session.id;
    const updatedPayment = await prisma.payment.update(
        {
            where: {
                checkoutSessionId: sid,
            },
            data: {
                status: PaymentStatus.EXPIRED,
                failureReason: "Session Timeout"
            }
        }
    );
    return updatedPayment;
}


const stripeWebhook = async (payload: Buffer, signature: string) => {

    const endpointSecret = config.stripe_webhook_secret;
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    );

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.payment_status === "paid") {
                await handlePaymentSuccess(session);
            }
            break;
        }
        case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleSessionExpired(session);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}.`);
            break;
    }
};


const getMyPayments = async (tenantId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const status = (query as any)?.status;
    const where: PaymentWhereInput = { tenantId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy,
            select: paymentSelect
        }),
        prisma.payment.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getLandlordPayments = async (landlordId: string, query?: IQuery) => {
    const { page, limit, skip, take, orderBy } = calculatePagination(query);

    const status = (query as any)?.status;
    const where: PaymentWhereInput = { landlordId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take,
            orderBy,
            select: paymentSelect
        }),
        prisma.payment.count({ where })
    ]);

    return { data, meta: { page, limit, total } };
};

const getPaymentById = async (paymentId: string, userId: string) => {
    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id: paymentId },
        select: paymentSelect
    });

    if (payment.tenantId !== userId && payment.landlordId !== userId) {
        throw new Error("Unauthorized: You are not authorized to view this payment.");
    }

    return payment;
};


export const paymentService = {
    initiatePayment,
    getMyPayments,
    getLandlordPayments,
    stripeWebhook,
    getPaymentById,
};
