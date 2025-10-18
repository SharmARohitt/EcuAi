import { Router } from 'express';
import * as authController from '../controllers/authController';
import { strictRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', strictRateLimiter, authController.login);
router.post('/verify', strictRateLimiter, authController.verifySignature);
router.post('/nonce', strictRateLimiter, authController.getNonce);

export default router;
