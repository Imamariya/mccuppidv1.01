
import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';

interface RazorpayButtonProps {
  orderData: {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
  };
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({ orderData, onSuccess, onFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const isScriptLoaded = await paymentService.loadRazorpayScript();
    if (!isScriptLoaded) {
      onFailure("Failed to load Razorpay SDK. Check your internet connection.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "MalluCupid",
      description: "Pro Plan - 30 Days Membership",
      image: "https://cdn.mallucupid.com/assets/logo-small.png",
      order_id: orderData.orderId,
      handler: async (response: any) => {
        // Success callback from Razorpay Modal
        const isVerified = await paymentService.verifyPayment({
          order_id: orderData.orderId,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        if (isVerified) {
          onSuccess();
        } else {
          onFailure("Payment verification failed. Please contact support if money was deducted.");
        }
      },
      prefill: {
        name: localStorage.getItem('mallucupid_user_name') || "",
        email: localStorage.getItem('mallucupid_user_email') || "",
      },
      theme: {
        color: "#059669" // Emerald-600 to match our brand
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error.description);
      setIsProcessing(false);
    });
    
    rzp.open();
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full py-4 bg-premium-green text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-70"
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span>OPENING CHECKOUT...</span>
        </>
      ) : (
        `PROCEED TO PAY ₹${orderData.amount / 100}`
      )}
    </button>
  );
};

export default RazorpayButton;
