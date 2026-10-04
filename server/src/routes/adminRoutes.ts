import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { getDashboardStats, getUsers, getStores } from '../controllers/adminController';
import { createUser, createStore } from '../controllers/adminCreateController';

const router = Router();

// Protect all admin routes
router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/stores', getStores);
router.post('/stores', createStore);

export default router;
