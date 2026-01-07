
export const paymentService = {
  /**
   * Initiates the Pro Plan purchase flow.
   */
  async startUpgradeFlow(gateway: 'razorpay' | 'stripe' = 'razorpay'): Promise<boolean> {
    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
        },
        body: JSON.stringify({ gateway, plan: 'pro' })
      });

      if (!orderRes.ok) throw new Error('Failed to create payment order');
      const orderData = await orderRes.json();

      // 2. Simulate Payment Gateway Interaction
      // In production, this would open Razorpay Checkout or Stripe Elements
      console.log(`MOCK GATEWAY: Opening ${gateway} for Order ${orderData.orderId}`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 3. Verify Payment on Backend
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          paymentId: `pay_${Math.random().toString(36).substring(7)}`,
          signature: 'valid_mock_signature'
        })
      });

      if (!verifyRes.ok) throw new Error('Payment verification failed');
      
      return true;
    } catch (error) {
      console.error('Payment Flow Error:', error);
      return false;
    }
  }
};
