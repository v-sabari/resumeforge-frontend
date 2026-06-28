import { createPayment, verifyPayment } from '../services/paymentService';

// Added: dynamically loads Razorpay SDK before use
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
}

export async function initiatePayment(onSuccess, onFailure) {
  try {

    // Step 0 — Ensure Razorpay SDK is loaded
    await loadRazorpayScript();

    // Step 1 — Create order from backend
    const orderData = await createPayment();

    if (!orderData?.orderId) {
      throw new Error('Failed to create order. Please try again.');
    }

    // Step 2 — Open Razorpay checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'ResumeForge AI',
      description: 'Premium Plan',
      theme: { color: '#6366f1' },

      // Step 3 — Verify on success
      handler: async function (response) {
        try {
          await verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
          if (onSuccess) onSuccess();
        } catch (err) {
          if (onFailure) onFailure(err?.response?.data?.message || err.message);
        }
      },

      modal: {
        ondismiss: function () {
          console.log('Payment popup closed by user');
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      if (onFailure) onFailure(response.error.description);
    });

    rzp.open();

  } catch (err) {
    if (onFailure) onFailure(err?.response?.data?.message || err.message);
  }
}