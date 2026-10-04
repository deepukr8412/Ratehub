import { Request, Response } from 'express';
import { pool } from '../database/db';

export const getPublicStores = async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryStr = `
      SELECT s.id, s.name, s.address, 
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND (s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryStr += ` GROUP BY s.id ORDER BY average_rating DESC, s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit as string), offset);

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) FROM stores WHERE 1=1 ${search ? `AND (name ILIKE $1 OR address ILIKE $1)` : ''}`;
    const countParams = search ? [`%${search}%`] : [];
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count);

    const storesResult = await pool.query(queryStr, queryParams);

    res.json({
      stores: storesResult.rows,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Error fetching public stores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStoreDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get Store basic info
    const storeResult = await pool.query(`
      SELECT id, name, address, email
      FROM stores
      WHERE id = $1
    `, [id]);

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Get analytics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_ratings,
        COALESCE(AVG(rating), 0) as average_rating
      FROM ratings
      WHERE store_id = $1
    `, [id]);

    // Get distribution
    const distResult = await pool.query(`
      SELECT rating, COUNT(*) as count
      FROM ratings
      WHERE store_id = $1
      GROUP BY rating
      ORDER BY rating DESC
    `, [id]);

    res.json({
      store: storeResult.rows[0],
      stats: {
        totalRatings: parseInt(statsResult.rows[0].total_ratings),
        averageRating: parseFloat(statsResult.rows[0].average_rating).toFixed(1)
      },
      distribution: distResult.rows
    });
  } catch (error) {
    console.error('Error fetching store details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const submitRating = async (req: Request, res: Response) => {
  try {
    const { id: store_id } = req.params;
    const { rating } = req.body;
    const user_id = (req as any).user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Insert or update rating. Since phase 1 specifies UNIQUE(user_id, store_id), we can use ON CONFLICT
    const result = await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating = EXCLUDED.rating, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [user_id, store_id, rating]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserStoreRating = async (req: Request, res: Response) => {
  try {
    const { id: store_id } = req.params;
    const user_id = (req as any).user.id;

    const result = await pool.query('SELECT rating FROM ratings WHERE user_id = $1 AND store_id = $2', [user_id, store_id]);
    
    if (result.rows.length === 0) {
      return res.json({ rating: null });
    }

    res.json({ rating: result.rows[0].rating });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
