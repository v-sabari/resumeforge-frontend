import { createPayment, verifyPayment } from '../services/paymentService';

// PAY-1: Razorpay Checkout asks for a mobile number even though the user is
// signed in because the options object had no `prefill`. The caller now
// passes the user's profile so name/email/contact are pre-filled and the
// contact-details step is skipped.
//
// PAY-2: the order summary showed only "₹749" with no product name or
// description. We now set `description` and `notes` so the checkout panel
// and the Razorpay dashboard both show what was bought and for whom.
//
// `userProfile` is optional but recommended: { name, email, phone }.

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

const PRODUCT_NAME = 'ResumeForge AI Premium – lifetime access';
const PLAN_ID = 'premium_lifetime';

export async function initiatePayment(onSuccess, onFailure, userProfile) {
  try {

    // Step 0 — Ensure Razorpay SDK is loaded
    await loadRazorpayScript();

    // Step 1 — Create order from backend
    const orderData = await createPayment();

    if (!orderData?.orderId) {
      throw new Error('Failed to create order. Please try again.');
    }

    // PAY-1: prefill name/email/contact from the signed-in user's profile.
    // Razorpay requires a valid contact for UPI/Card flows; if the user's
    // profile lacks a phone, the checkout will still ask for it, but the
    // name and email are pre-filled so the contact step is the only thing
    // left. We do NOT require a phone at signup.
    const prefill = {};
    if (userProfile) {
      if (userProfile.name)  prefill.name  = String(userProfile.name).slice(0, 100);
      if (userProfile.email) prefill.email = String(userProfile.email).slice(0, 100);
      if (userProfile.phone) prefill.contact = String(userProfile.phone).replace(/[^\d+]/g, '').slice(0, 15);
    }

    // PAY-2: notes attach to the payment record in the Razorpay dashboard
    // and are also visible in the webhook payload, so support can tie a
    // payment to a userId/plan without a DB lookup.
    const notes = {};
    if (userProfile?.id) notes.userId = String(userProfile.id);
    notes.plan = PLAN_ID;

    // Step 2 — Open Razorpay checkout
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'ResumeForge AI',
      // PAY-2: show what the user is buying, not just the price.
      description: PRODUCT_NAME,
      // PAY-1: pre-fill contact details from the signed-in user.
      ...(Object.keys(prefill).length ? { prefill } : {}),
      // PAY-2: notes for dashboard + webhook reconciliation.
      notes,
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
          // FIX: previously this only logged — PricingPage kept its "Opening
          // payment…" loading state forever because onFailure (which resets
          // loading) was never called when the checkout modal was dismissed.
          if (onFailure) onFailure('Payment window closed. No charges were made.');
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
