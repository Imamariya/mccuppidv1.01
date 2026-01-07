import { Router, Response } from 'express';
import { User } from '../models/User';
import { Match } from '../models/Match';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get match feed
router.get('/feed', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastMatchReset && new Date(user.lastMatchReset) < today) {
      user.matchesUsedToday = 0;
      user.lastMatchReset = today;
      await user.save();
    }

    if (user.matchesUsedToday >= user.matchesPerDay && !user.isPro) {
      return res.json({ matches: [], reachedLimit: true });
    }

    // Find users matching criteria
    const matches = await User.find({
      _id: { $ne: req.user?.id },
      gender: user.relationshipPreferences?.genderPreference,
      isProfileComplete: true,
      isVerified: true,
      $expr: {
        $and: [
          { $gte: ['$age', user.relationshipPreferences?.ageMin || 18] },
          { $lte: ['$age', user.relationshipPreferences?.ageMax || 60] }
        ]
      }
    })
    .limit(10)
    .select('-password');

    res.json({ matches, reachedLimit: false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Like a user
router.post('/like/:targetUserId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    // Check if already liked
    const existing = await Match.findOne({
      userId,
      targetUserId,
      action: 'like'
    });

    if (existing) {
      return res.status(400).json({ error: 'Already liked this user' });
    }

    const match = new Match({
      userId,
      targetUserId,
      action: 'like'
    });

    await match.save();

    // Update user match count
    const user = await User.findById(userId);
    if (user) {
      user.matchesUsedToday += 1;
      await user.save();
    }

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reject a user
router.post('/reject/:targetUserId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const match = new Match({
      userId: req.user?.id,
      targetUserId: req.params.targetUserId,
      action: 'reject'
    });

    await match.save();

    // Update user match count
    const user = await User.findById(req.user?.id);
    if (user) {
      user.matchesUsedToday += 1;
      await user.save();
    }

    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get mutual matches
router.get('/mutual', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userMatches = await Match.find({
      userId: req.user?.id,
      action: 'like'
    }).select('targetUserId');

    const userIds = userMatches.map(m => m.targetUserId);

    const mutual = await Match.find({
      userId: { $in: userIds },
      targetUserId: req.user?.id,
      action: 'like'
    }).populate('userId', '-password');

    res.json({ matches: mutual });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
