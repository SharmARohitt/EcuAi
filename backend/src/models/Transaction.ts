import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  asset: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  
  buyerAddress: string;
  sellerAddress: string;
  
  // Transaction details
  type: 'purchase' | 'royalty' | 'transfer';
  amount: number;
  currency: string;
  
  // Blockchain
  txHash: string;
  blockNumber?: number;
  gasUsed?: number;
  
  // Status
  status: 'pending' | 'confirmed' | 'failed';
  
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    asset: {
      type: Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    sellerAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'royalty', 'transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'ETH',
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    blockNumber: {
      type: Number,
    },
    gasUsed: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TransactionSchema.index({ asset: 1 });
TransactionSchema.index({ buyer: 1 });
TransactionSchema.index({ seller: 1 });
TransactionSchema.index({ txHash: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
