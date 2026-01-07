import { Router, Response, Request } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken((user._id as any).toString(), 'user');
    res.status(201).json({ token, userId: user._id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as any;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role);
    res.json({ token, userId: user._id, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, age, gender, bio, location, relationshipPreferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name,
        age,
        gender,
        bio,
        location,
        relationshipPreferences,
        isProfileComplete: true,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload profile images
router.post('/upload-images', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrls } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { profileImages: imageUrls },
      { new: true }
    );

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload verification selfie
router.post('/verification-selfie', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { selfieUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { 
        verificationSelfieUrl: selfieUrl,
        isVerified: false // Needs admin approval
      },
      { new: true }
    );

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
