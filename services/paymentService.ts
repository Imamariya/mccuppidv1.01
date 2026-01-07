
export const paymentService = {
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  async createOrder(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      orderId: `order_${Math.random().toString(36).substring(7)}`,
      amount: 9900,
      currency: 'INR',
      key: 'rzp_test_mock_key'
    };
  },

  async verifyPayment(paymentData: {
    order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem('mallucupid_plan', 'pro');
    return true;
  }
};
