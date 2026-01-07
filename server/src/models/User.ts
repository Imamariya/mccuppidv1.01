import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  name: {
    type: String,
    required: true
  },
  age: Number,
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary'],
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  bio: String,
  profileImages: [String],
  verificationSelfieUrl: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  isPro: {
    type: Boolean,
    default: false
  },
  proExpiresAt: Date,
  relationshipPreferences: {
    ageMin: { type: Number, default: 18 },
    ageMax: { type: Number, default: 60 },
    genderPreference: [String],
    distanceRadius: { type: Number, default: 50 }, // km
    relationshipType: String
  },
  matchesPerDay: {
    type: Number,
    default: 10
  },
  matchesUsedToday: {
    type: Number,
    default: 0
  },
  lastMatchReset: Date,
  blockedUsers: [mongoose.Schema.Types.ObjectId],
  favorites: [mongoose.Schema.Types.ObjectId],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
userSchema.index({ 'location': '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next: any) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_ROUNDS || '10'));
    (this as any).password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export { mongoose };
export default mongoose.model('User', userSchema);
