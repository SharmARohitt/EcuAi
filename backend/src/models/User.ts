import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  address: string;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  
  // Stats
  assetsCreated: number;
  assetsPurchased: number;
  totalEarnings: number;
  reputation: number;
  
  // Social
  website?: string;
  twitter?: string;
  github?: string;
  
  // Verification
  verified: boolean;
  verifiedAt?: Date;
  
  // Settings
  emailNotifications: boolean;
  publicProfile: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    assetsCreated: {
      type: Number,
      default: 0,
    },
    assetsPurchased: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    reputation: {
      type: Number,
      default: 0,
    },
    website: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    publicProfile: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ address: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ reputation: -1 });

export default mongoose.model<IUser>('User', UserSchema);
