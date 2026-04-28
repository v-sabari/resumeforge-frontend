import api from './api';

/**
 * Create a Razorpay order via backend.
 * Returns { orderId, amount, currency, keyId }
 */
export const createPayment = async (amount) => {
  const { data } = await api.post('/api/payments/create', amount ? { amount } : {});
  return data;
};

/**
 * Verify payment after Razorpay Checkout SDK completes.
 *
 * After the user pays, Razorpay's handler() callback gives us:
 *   razorpay_order_id
 *   razorpay_payment_id
 *   razorpay_signature
 *
 * We send all three to backend which verifies the HMAC-SHA256 signature
 * before granting premium. Never send a status field — backend ignores it.
 *
 * @param {string} razorpayOrderId   - from Razorpay handler response
 * @param {string} razorpayPaymentId - from Razorpay handler response
 * @param {string} razorpaySignature - from Razorpay handler response
 * @returns {Promise<object>} ApiResponse from backend
 */
export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const { data } = await api.post('/api/payments/verify', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
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