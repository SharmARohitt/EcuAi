import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';
import { logger } from '../utils/logger';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const testModel = async (req: AuthRequest, res: Response) => {
  try {
    const { modelHash, inputData, privacyMode } = req.body;

    if (!modelHash || !inputData) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Forward request to AI runtime service
    const response = await axios.post(`${AI_SERVICE_URL}/sandbox/execute`, {
      model_hash: modelHash,
      input_data: inputData,
      privacy_mode: privacyMode !== false,
    });

    logger.info(`Sandbox test completed for model: ${modelHash}`);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error testing model:', error);
    res.status(500).json({ success: false, message: 'Failed to test model' });
  }
};

export const analyzeModel = async (req: AuthRequest, res: Response) => {
  try {
    const { modelHash, modelType } = req.body;

    if (!modelHash || !modelType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Forward request to AI runtime service
    const response = await axios.post(`${AI_SERVICE_URL}/analyze/model`, {
      model_hash: modelHash,
      model_type: modelType,
    });

    logger.info(`Model analysis completed for: ${modelHash}`);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    logger.error('Error analyzing model:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze model' });
  }
};
