import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getPublicStores, getStoreDetails, submitRating, getUserStoreRating } from '../controllers/storeController';

const router = Router();

// Publicly accessible store listing
router.get('/', getPublicStores);
router.get('/:id', getStoreDetails);

// Protected routes (Normal User)
router.get('/:id/rating', requireAuth, requireRole(['USER']), getUserStoreRating);
router.post('/:id/rating', requireAuth, requireRole(['USER']), submitRating);
router.put('/:id/rating', requireAuth, requireRole(['USER']), submitRating); // Using same function as it has UPSERT

export default router;
