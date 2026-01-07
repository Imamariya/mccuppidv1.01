import { Router, Response, Request } from 'express';
import { Subscription } from '../models/Subscription';
import User from '../models/User';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'pro',
        name: 'Pro',
        price: 9.99,
        currency: 'USD',
        period: 'month',
        features: {
          unlimitedLikes: true,
          unlimitedMessages: false,
          advancedFilters: true,
          profileBoost: false,
          superLikes: 10,
          priorityMatches: false
        }
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 19.99,
        currency: 'USD',
        period: 'month',
        features: {
          unlimitedLikes: true,
          unlimitedMessages: true,
          advancedFilters: true,
          profileBoost: true,
          superLikes: 50,
          priorityMatches: true
        }
      }
    ];

    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's subscription
router.get('/current', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user?.id
    });

    res.json(subscription || { plan: 'free' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create subscription
router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan, stripeTokenId } = req.body;

    // In production, verify with Stripe
    const subscription = new Subscription({
      userId: req.user?.id,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      amount: plan === 'pro' ? 9.99 : 19.99,
      features: {
        unlimitedLikes: true,
        unlimitedMessages: plan === 'premium',
        advancedFilters: true,
        profileBoost: plan === 'premium',
        superLikes: plan === 'premium' ? 50 : 10,
        priorityMatches: plan === 'premium'
      }
    });

    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(
      req.user?.id,
      {
        isPro: true,
        proExpiresAt: subscription.endDate
      }
    );

    res.status(201).json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user?.id },
      { status: 'cancelled' },
      { new: true }
    );

    await User.findByIdAndUpdate(
      req.user?.id,
      { isPro: false }
    );

    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
