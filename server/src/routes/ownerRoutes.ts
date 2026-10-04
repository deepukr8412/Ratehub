import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { pool } from '../database/db';

const router = Router();

// Get store dashboard stats
router.get('/dashboard', requireAuth, requireRole(['STORE_OWNER']), async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.id;
    
    // Find the store for this owner
    const storeResult = await pool.query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found for this owner' });
    }
    
    const storeId = storeResult.rows[0].id;

    // Get analytics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_ratings,
        COALESCE(AVG(rating), 0) as average_rating
      FROM ratings
      WHERE store_id = $1
    `, [storeId]);

    // Get distribution
    const distResult = await pool.query(`
      SELECT rating, COUNT(*) as count
      FROM ratings
      WHERE store_id = $1
      GROUP BY rating
      ORDER BY rating DESC
    `, [storeId]);

    // Get recent ratings
    const recentResult = await pool.query(`
      SELECT r.rating, r.created_at, u.name as user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [storeId]);

    res.json({
      store: storeResult.rows[0],
      stats: {
        totalRatings: parseInt(statsResult.rows[0].total_ratings),
        averageRating: parseFloat(statsResult.rows[0].average_rating).toFixed(1)
      },
      distribution: distResult.rows,
      recentRatings: recentResult.rows
    });

  } catch (error) {
    console.error('Error fetching owner dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
