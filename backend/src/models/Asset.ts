import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
  name: string;
  description: string;
  type: 'model' | 'dataset' | 'compute';
  category: string;
  creator: mongoose.Types.ObjectId;
  creatorAddress: string;
  
  // File information
  ipfsHash: string;
  fileSize: number;
  fileType: string;
  
  // DKG & Blockchain
  dkgKAID: string;
  tokenId?: string;
  contractAddress?: string;
  
  // Pricing
  price: number;
  currency: string;
  royaltyPercentage: number;
  
  // Metadata
  version: string;
  license: string;
  tags: string[];
  framework?: string;
  
  // Stats
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  
  // Status
  verified: boolean;
  featured: boolean;
  active: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: ['model', 'dataset', 'compute'],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    ipfsHash: {
      type: String,
      required: true,
      unique: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    dkgKAID: {
      type: String,
      required: true,
      unique: true,
    },
    tokenId: {
      type: String,
      sparse: true,
    },
    contractAddress: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'ETH',
    },
    royaltyPercentage: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    license: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    framework: {
      type: String,
      trim: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AssetSchema.index({ name: 'text', description: 'text', tags: 'text' });
AssetSchema.index({ type: 1, category: 1 });
AssetSchema.index({ creatorAddress: 1 });
AssetSchema.index({ verified: 1, active: 1 });
AssetSchema.index({ createdAt: -1 });

export default mongoose.model<IAsset>('Asset', AssetSchema);
