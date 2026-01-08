import { Router, Response, Request } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendWelcomeEmail, initEmailService } from '../utils/email';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Initialize email service
initEmailService();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({ 
      email: email.toLowerCase(), 
      password, 
      name 
    });
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    const token = generateToken((user._id as any).toString(), 'user');
    res.status(201).json({ 
      success: true,
      message: 'Account created successfully. Welcome email sent.',
      token, 
      userId: user._id,
      role: 'user'
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
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
