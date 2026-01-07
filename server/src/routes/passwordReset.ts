import { Router, Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import bcryptjs from 'bcryptjs';

const router = Router();

/**
 * POST /api/auth/forgot-password
 * Request password reset via email
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If this email exists, you will receive a password reset link'
      });
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Hash the reset token
    const hashedToken = await bcryptjs.hash(resetToken, 10);

    // Update user with reset token and expiry
    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.save();

    // PRODUCTION: Send email with reset link
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // await sendResetEmail(user.email, resetLink);

    console.log(`[PRODUCTION] Send reset email to ${email}`);
    console.log(`Reset token: ${resetToken}`);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain an uppercase letter' });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain a lowercase letter' });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain a number' });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must contain a special character (!@#$%^&*)'
      });
    }

    // Find user with valid reset token
    const users = await User.find({
      resetTokenExpiry: { $gt: new Date() }
    });

    let user = null;
    for (const u of users) {
      if (u.resetToken && await bcryptjs.compare(token, u.resetToken)) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * POST /api/auth/change-password
 * Change password when already authenticated
 */
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user
    const user = await User.findById(userId) as any;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain an uppercase letter' });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain a lowercase letter' });
    }

    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ error: 'Password must contain a number' });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({
        error: 'Password must contain a special character (!@#$%^&*)'
      });
    }

    // Prevent using same password
    const isSameAsOld = await user.comparePassword(newPassword);
    if (isSameAsOld) {
      return res.status(400).json({
        error: 'New password must be different from current password'
      });
    }

    // Hash and update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
