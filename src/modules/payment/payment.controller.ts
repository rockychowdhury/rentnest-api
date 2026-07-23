import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { paymentService } from "./payment.service";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const { leaseId } = req.params;
    const userId = req.user?.id;
    const result = await paymentService.initiatePayment(leaseId as string, userId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment Success",
        data: result
    });
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as Buffer;
    const signature = req.headers['stripe-signature'];

    const result = await paymentService.stripeWebhook(payload, signature as string);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Webhook triggered Successful",
        data: result
    });
});


const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const tenantId = req.user?.id;
    const result = await paymentService.getMyPayments(tenantId as string, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Success",
        data: result.data,
        meta: result.meta
    });
});

const getLandlordPayments = catchAsync(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;
    const result = await paymentService.getLandlordPayments(landlordId as string, req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Success",
        data: result.data,
        meta: result.meta
    });
});





const getPaymentById = catchAsync(async (req: Request, res: Response) => {

    const { paymentId } = req.params;
    const userId = req.user?.id;
    const result = await paymentService.getPaymentById(paymentId as string, userId as string);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Success",
        data: result
    });
});


export const paymentController = {
    initiatePayment,
    getMyPayments,
    getLandlordPayments,
    stripeWebhook,
    getPaymentById,
};
