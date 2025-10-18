import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import Asset from '../models/Asset';
import User from '../models/User';
import { logger } from '../utils/logger';

export const purchaseAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { assetId, txHash, amount } = req.body;

    if (!assetId || !txHash || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    const buyer = await User.findOne({ address: req.user!.address.toLowerCase() });
    if (!buyer) {
      return res.status(404).json({ success: false, message: 'Buyer not found' });
    }

    const seller = await User.findById(asset.creator);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      asset: asset._id,
      buyer: buyer._id,
      seller: seller._id,
      buyerAddress: buyer.address,
      sellerAddress: seller.address,
      type: 'purchase',
      amount: parseFloat(amount),
      currency: 'ETH',
      txHash,
      status: 'pending',
    });

    // Update asset stats
    asset.downloads += 1;
    await asset.save();

    // Update user stats
    buyer.assetsPurchased += 1;
    await buyer.save();

    logger.info(`Transaction created: ${transaction._id}`);

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Failed to create transaction' });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('asset', 'name type')
      .populate('buyer', 'username address')
      .populate('seller', 'username address');

    res.json({ success: true, data: transactions });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

export const getAssetTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { assetId } = req.params;

    const transactions = await Transaction.find({ asset: assetId })
      .sort({ createdAt: -1 })
      .populate('buyer', 'username address')
      .populate('seller', 'username address');

    res.json({ success: true, data: transactions });
  } catch (error) {
    logger.error('Error fetching asset transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

export const verifyTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { txHash } = req.body;

    if (!txHash) {
      return res.status(400).json({ success: false, message: 'Transaction hash required' });
    }

    const transaction = await Transaction.findOne({ txHash });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // In production, verify transaction on blockchain
    // For now, just return the transaction status
    res.json({
      success: true,
      verified: transaction.status === 'confirmed',
      data: transaction,
    });
  } catch (error) {
    logger.error('Error verifying transaction:', error);
    res.status(500).json({ success: false, message: 'Failed to verify transaction' });
  }
};
