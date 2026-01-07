import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
};
