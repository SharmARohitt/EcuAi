import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { strictRateLimiter } from '../middleware/rateLimiter';
import * as assetController from '../controllers/assetController';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

// Public routes
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.get('/verify/:kaid', assetController.verifyAssetProvenance);
router.get('/search', assetController.searchAssets);
router.get('/category/:category', assetController.getAssetsByCategory);

// Protected routes
router.post(
  '/upload',
  authenticate,
  strictRateLimiter,
  upload.single('file'),
  assetController.uploadAsset
);

router.put('/:id', authenticate, assetController.updateAsset);
router.delete('/:id', authenticate, assetController.deleteAsset);
router.post('/:id/view', assetController.incrementViews);

export default router;
