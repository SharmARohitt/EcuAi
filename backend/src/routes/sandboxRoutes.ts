import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import * as sandboxController from '../controllers/sandboxController';

const router = Router();

router.post(
  '/test',
  authenticate,
  strictRateLimiter,
  sandboxController.testModel
);

router.post(
  '/analyze',
  authenticate,
  strictRateLimiter,
  sandboxController.analyzeModel
);

export default router;
