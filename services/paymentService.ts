
export const paymentService = {
  /**
   * Loads the Razorpay checkout script dynamically into the document.
   */
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

  /**
   * Calls the backend to create a Razorpay order.
   */
  async createOrder(): Promise<any> {
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      },
      body: JSON.stringify({ gateway: 'razorpay', plan: 'pro' })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create order');
    }

    return res.json();
  },

  /**
   * Calls the backend to verify the Razorpay payment signature.
   */
  async verifyPayment(paymentData: {
    order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<boolean> {
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return data.success;
  }
};
