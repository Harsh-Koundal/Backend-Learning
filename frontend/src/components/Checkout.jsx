import React, { useState, useEffect } from 'react';
import api from '../context/api';
import toast from 'react-hot-toast';

const Checkout = ({ amountInINR }) => {
  const [loading, setLoading] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const amountPaise = amountInINR * 100;

      const { data } = await api.post('/api/payments/create', {
        amount: amountPaise,
      });

      const { order } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // FIXED
        amount: order.amount,
        currency: order.currency,
        name: "Auth",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            await api.post("/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // FIXED
            window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}`;
          } catch (err) {
            console.error("verification failed", err);
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          email: "admin@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong creating payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : `Pay ₹${amountInINR}`}
    </button>
  );
};

export default Checkout;
