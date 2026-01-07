
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { gateway, plan } = await request.json();

    // Production: Use razorpay/stripe SDK to create actual order
    const orderId = `${gateway.toUpperCase()}_ORD_${Date.now()}`;
    const amount = 9900; // ₹99.00 in paise/cents

    return NextResponse.json({
      orderId,
      amount,
      currency: 'INR',
      key: gateway === 'razorpay' ? 'rzp_test_mock_key' : 'pk_test_mock_key'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
