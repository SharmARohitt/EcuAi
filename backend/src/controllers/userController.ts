import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Asset from '../models/Asset';
import Transaction from '../models/Transaction';
import { logger } from '../utils/logger';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ address: req.user!.address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, bio, avatar, website, twitter, github } = req.body;

    const user = await User.findOne({ address: req.user!.address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if username is already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
      user.username = username;
    }

    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (website) user.website = website;
    if (twitter) user.twitter = twitter;
    if (github) user.github = github;

    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ address: req.user!.address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user's assets
    const assets = await Asset.find({ creator: user._id, active: true })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent transactions
    const transactions = await Transaction.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('asset', 'name type');

    // Calculate stats
    const totalViews = assets.reduce((sum, asset) => sum + asset.views, 0);
    const totalDownloads = assets.reduce((sum, asset) => sum + asset.downloads, 0);

    res.json({
      success: true,
      data: {
        user,
        assets,
        transactions,
        stats: {
          totalAssets: user.assetsCreated,
          totalPurchases: user.assetsPurchased,
          totalEarnings: user.totalEarnings,
          totalViews,
          totalDownloads,
          reputation: user.reputation,
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard' });
  }
};

export const getUserAssets = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ address: req.user!.address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const assets = await Asset.find({ creator: user._id, active: true }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: assets });
  } catch (error) {
    logger.error('Error fetching user assets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assets' });
  }
};

export const getUserTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ address: req.user!.address.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ buyer: user._id }, { seller: user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('asset', 'name type price')
      .populate('buyer', 'username address')
      .populate('seller', 'username address');

    res.json({ success: true, data: transactions });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};
