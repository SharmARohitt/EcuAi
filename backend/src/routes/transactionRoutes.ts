import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as transactionController from '../controllers/transactionController';

const router = Router();

router.post('/purchase', authenticate, transactionController.purchaseAsset);
router.get('/:userId', authenticate, transactionController.getUserTransactions);
router.get('/asset/:assetId', transactionController.getAssetTransactions);
router.post('/verify', transactionController.verifyTransaction);

export default router;
