import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ethers } from 'ethers';
import User from '../models/User';
import { logger } from '../utils/logger';

// Store nonces temporarily (use Redis in production)
const nonces = new Map<string, string>();

export const getNonce = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ success: false, message: 'Address required' });
    }

    const nonce = crypto.randomBytes(32).toString('hex');
    nonces.set(address.toLowerCase(), nonce);

    // Clean up old nonces after 5 minutes
    setTimeout(() => {
      nonces.delete(address.toLowerCase());
    }, 5 * 60 * 1000);

    res.json({ success: true, nonce });
  } catch (error) {
    logger.error('Error generating nonce:', error);
    res.status(500).json({ success: false, message: 'Failed to generate nonce' });
  }
};

export const verifySignature = async (req: Request, res: Response) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Verify nonce
    const storedNonce = nonces.get(address.toLowerCase());
    if (!storedNonce || !message.includes(storedNonce)) {
      return res.status(401).json({ success: false, message: 'Invalid or expired nonce' });
    }

    // Clean up nonce
    nonces.delete(address.toLowerCase());

    // Find or create user
    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = await User.create({
        address: address.toLowerCase(),
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        address: user.address,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        address: user.address,
        username: user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error('Error verifying signature:', error);
    res.status(500).json({ success: false, message: 'Failed to verify signature' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { address, signature, message } = req.body;

    if (!address || !signature || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Find or create user
    let user = await User.findOne({ address: address.toLowerCase() });
    if (!user) {
      user = await User.create({
        address: address.toLowerCase(),
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        address: user.address,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    logger.info(`User logged in: ${user.address}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        address: user.address,
        username: user.username,
        avatar: user.avatar,
        verified: user.verified,
      },
    });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};
