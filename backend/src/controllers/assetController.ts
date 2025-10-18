import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Asset from '../models/Asset';
import User from '../models/User';
import dkgService from '../services/dkgService';
import ipfsService from '../services/ipfsService';
import { createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const getAllAssets = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = { active: true };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.verified === 'true') {
      filter.verified = true;
    }

    const assets = await Asset.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'username address avatar');

    const total = await Asset.countDocuments(filter);

    res.json({
      success: true,
      data: assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching assets:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assets' });
  }
};

export const getAssetById = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id).populate(
      'creator',
      'username address avatar reputation'
    );

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, data: asset });
  } catch (error) {
    logger.error('Error fetching asset:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch asset' });
  }
};

export const uploadAsset = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      throw createError('No file uploaded', 400);
    }

    const { name, description, type, category, price, royaltyPercentage, license, tags, framework } =
      req.body;

    // Validate required fields
    if (!name || !description || !type || !category || !price || !license) {
      throw createError('Missing required fields', 400);
    }

    // Upload file to IPFS
    logger.info('Uploading file to IPFS...');
    const ipfsResult = await ipfsService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      {
        name,
        type,
        creator: req.user!.address,
      }
    );

    // Publish metadata to DKG
    logger.info('Publishing to DKG...');
    const dkgResult = await dkgService.publishAsset({
      name,
      description,
      type,
      ipfsHash: ipfsResult.ipfsHash,
      creator: req.user!.address,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      license,
    });

    // Find or create user
    let user = await User.findOne({ address: req.user!.address.toLowerCase() });
    if (!user) {
      user = await User.create({
        address: req.user!.address.toLowerCase(),
      });
    }

    // Create asset record
    const asset = await Asset.create({
      name,
      description,
      type,
      category,
      creator: user._id,
      creatorAddress: req.user!.address.toLowerCase(),
      ipfsHash: ipfsResult.ipfsHash,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      dkgKAID: dkgResult.UAL,
      price: parseFloat(price),
      royaltyPercentage: parseInt(royaltyPercentage) || 10,
      license,
      tags: tags ? JSON.parse(tags) : [],
      framework,
      verified: false,
    });

    // Update user stats
    user.assetsCreated += 1;
    await user.save();

    logger.info(`Asset created: ${asset._id}`);

    res.status(201).json({
      success: true,
      data: asset,
      ipfs: {
        hash: ipfsResult.ipfsHash,
        url: ipfsService.getIPFSUrl(ipfsResult.ipfsHash),
      },
      dkg: {
        UAL: dkgResult.UAL,
      },
    });
  } catch (error) {
    logger.error('Error uploading asset:', error);
    res.status(500).json({ success: false, message: 'Failed to upload asset' });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    if (asset.creatorAddress !== req.user!.address.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, price, tags } = req.body;

    if (name) asset.name = name;
    if (description) asset.description = description;
    if (price) asset.price = parseFloat(price);
    if (tags) asset.tags = tags;

    await asset.save();

    res.json({ success: true, data: asset });
  } catch (error) {
    logger.error('Error updating asset:', error);
    res.status(500).json({ success: false, message: 'Failed to update asset' });
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    if (asset.creatorAddress !== req.user!.address.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    asset.active = false;
    await asset.save();

    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting asset:', error);
    res.status(500).json({ success: false, message: 'Failed to delete asset' });
  }
};

export const verifyAssetProvenance = async (req: AuthRequest, res: Response) => {
  try {
    const { kaid } = req.params;

    const result = await dkgService.verifyProvenance(kaid);

    res.json({
      success: true,
      verified: result.verified,
      data: result.data,
    });
  } catch (error) {
    logger.error('Error verifying provenance:', error);
    res.status(500).json({ success: false, message: 'Failed to verify provenance' });
  }
};

export const searchAssets = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const assets = await Asset.find({
      $text: { $search: q as string },
      active: true,
    })
      .limit(20)
      .populate('creator', 'username address avatar');

    res.json({ success: true, data: assets });
  } catch (error) {
    logger.error('Error searching assets:', error);
    res.status(500).json({ success: false, message: 'Failed to search assets' });
  }
};

export const getAssetsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;

    const assets = await Asset.find({ category, active: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('creator', 'username address avatar');

    res.json({ success: true, data: assets });
  } catch (error) {
    logger.error('Error fetching assets by category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch assets' });
  }
};

export const incrementViews = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' });
    }

    res.json({ success: true, views: asset.views });
  } catch (error) {
    logger.error('Error incrementing views:', error);
    res.status(500).json({ success: false, message: 'Failed to update views' });
  }
};
