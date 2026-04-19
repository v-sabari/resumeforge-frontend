import api from './api';

/**
 * Create a payment intent.
 * Returns { paymentId, paymentLink, razorpayKeyId, ... }
 * The caller should redirect to paymentLink.
 */
export const createPayment = async (amount) => {
  const { data } = await api.post('/api/payments/create', amount ? { amount } : {});
  return data;
};

/**
 * Verify a Razorpay Payment Link completion.
 *
 * After the user pays, Razorpay redirects to our callback URL with these
 * query parameters appended:
 *   ?razorpay_payment_id=pay_XXX
 *   &razorpay_payment_link_id=plink_XXX
 *   &razorpay_payment_link_reference_id=our_internal_payment_id
 *   &razorpay_payment_link_status=paid
 *   &razorpay_signature=hmac_hex_string
 *
 * The frontend must collect them from the URL and pass them here.
 * The backend verifies the HMAC-SHA256 signature before granting premium.
 *
 * DO NOT add a `status` field or send any other trust signals —
 * the backend ignores them and uses only the verified signature.
 *
 * @param {URLSearchParams} params - The URL search params from the callback URL
 * @returns {Promise<object>} Payment record from backend
 */
export const verifyPaymentCallback = async (params) => {
  const payload = {
    razorpayPaymentId:                params.get('razorpay_payment_id'),
    razorpayPaymentLinkId:            params.get('razorpay_payment_link_id'),
    razorpayPaymentLinkReferenceId:   params.get('razorpay_payment_link_reference_id'),
    razorpayPaymentLinkStatus:        params.get('razorpay_payment_link_status'),
    razorpaySignature:                params.get('razorpay_signature'),
  };

  const { data } = await api.post('/api/payments/verify', payload);
  return data;
};

/**
 * Fetch payment history for the authenticated user.
 * Returns an array of payment records.
 */
export const getPaymentHistory = async () => {
  const { data } = await api.get('/api/payments/history');
  return data;
};
