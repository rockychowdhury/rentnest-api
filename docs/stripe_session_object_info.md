    /*
    1. sId
    2. metadata {leaseId,tenantId,paymentId}
    3. payment_status
    4. status
    5. payment_method_types
    6. payment_method_options
    7. payment_intent
    8. mode
    9. invoice
    10. expires_at
    11. customer_details{}
    12. currency
    13. cancel_url
    14. branding_settings{}
    15. amount_total, amount_subtotal
    16. 
    */

{
  id: 'cs_test_a1R6peeS2CzCTibEfCuJW0rgb0oLjpYrVtfh9HOTxCazxz0v9LCLpMYq7J',
  object: 'checkout.session',
  adaptive_pricing: { enabled: true },
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 1218000,
  amount_total: 1218000,
  automatic_tax: { enabled: false, liability: null, provider: null, status: null },
  billing_address_collection: null,
  branding_settings: {
    background_color: '#ffffff',
    border_style: 'rounded',
    button_color: '#0074d4',
    display_name: 'Development sandbox',
    font_family: 'default',
    icon: null,
    logo: null
  },
  cancel_url: 'http://localhost:5000/payment/checkout?success=false',
  client_reference_id: null,
  client_secret: null,
  collected_information: {
    business_name: null,
    individual_name: null,
    shipping_details: null
  },
  consent: null,
  consent_collection: null,
  created: 1784817345,
  currency: 'bdt',
  currency_conversion: null,
  custom_fields: [],
  custom_text: {
    after_submit: null,
    shipping_address: null,
    submit: null,
    terms_of_service_acceptance: null
  },
  customer: 'cus_UvxxvQkm9oL6N7',
  customer_account: null,
  customer_creation: null,
  customer_details: {
    address: {
      city: null,
      country: 'BD',
      line1: null,
      line2: null,
      postal_code: null,
      state: null
    },
    business_name: null,
    email: 'tenant@gmail.com',
    individual_name: null,
    name: 'Rocky Chowdhury',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: null,
  discounts: [],
  expires_at: 1784903745,
  integration_identifier: null,
  invoice: null,
  invoice_creation: {
    enabled: false,
    invoice_data: {
      account_tax_ids: null,
      custom_fields: null,
      description: null,
      footer: null,
      issuer: null,
      metadata: {},
      rendering_options: null
    }
  },
  livemode: false,
  locale: null,
  managed_payments: { enabled: false },
  metadata: {
    leaseId: '640393b6-2de5-459e-a74e-614fe86e59ba',
    tenantId: '281b1e37-7465-48f7-a123-d7f8f7d4f591',
    paymentId: 'fc77e55b-2fbb-4cd9-86a3-da63fd832220'
  },
  mode: 'payment',
  origin_context: null,
  payment_intent: 'pi_3TwNkQ1541ZgsQkc1dKa3uWr',
  payment_link: null,
  payment_method_collection: 'if_required',
  payment_method_configuration_details: null,
  payment_method_options: { card: { request_three_d_secure: 'automatic' } },
  payment_method_types: [ 'card' ],
  payment_status: 'paid',
  permissions: null,
  phone_number_collection: { enabled: false },
  recovered_from: null,
  saved_payment_method_options: {
    allow_redisplay_filters: [ 'always' ],
    payment_method_remove: 'disabled',
    payment_method_save: null
  },
  setup_intent: null,
  shipping_address_collection: null,
  shipping_cost: null,
  shipping_options: [],
  status: 'complete',
  submit_type: null,
  subscription: null,
  success_url: 'http://localhost:5000/payment/checkout?success=true',
  total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  ui_mode: 'hosted_page',
  url: null,
  wallet_options: null
}