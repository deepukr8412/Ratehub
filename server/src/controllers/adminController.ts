import { Request, Response } from 'express';
import { pool } from '../database/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const usersCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const storesCountResult = await pool.query('SELECT COUNT(*) FROM stores');
    const ratingsCountResult = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(usersCountResult.rows[0].count),
      totalStores: parseInt(storesCountResult.rows[0].count),
      totalRatings: parseInt(ratingsCountResult.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, sort = 'created_at', order = 'desc', page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryStr = 'SELECT * FROM users WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (role) {
      queryStr += ` AND role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) FROM (${queryStr}) as total`;
    const totalResult = await pool.query(countQuery, queryParams);
    const total = parseInt(totalResult.rows[0].count);

    // Add sorting and pagination
    const validSortColumns = ['name', 'email', 'role', 'created_at'];
    const sortColumn = validSortColumns.includes(sort as string) ? sort : 'created_at';
    const sortOrder = (order as string).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    queryStr += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit as string), offset);

    const usersResult = await pool.query(queryStr, queryParams);

    res.json({
      users: usersResult.rows,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const { search, sort = 'created_at', order = 'desc', page = '1', limit = '10' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let queryStr = `
      SELECT s.*, u.name as owner_name, 
      COALESCE(AVG(r.rating), 0) as average_rating,
      COUNT(r.id) as total_ratings
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND (s.name ILIKE $${paramIndex} OR s.email ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryStr += ` GROUP BY s.id, u.name`;

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) FROM (SELECT s.id FROM stores s WHERE 1=1 ${search ? `AND (s.name ILIKE $1 OR s.email ILIKE $1 OR s.address ILIKE $1)` : ''}) as total`;
    const countParams = search ? [`%${search}%`] : [];
    const totalResult = await pool.query(countQuery, countParams);
    const total = parseInt(totalResult.rows[0].count);

    // Add sorting and pagination
    const validSortColumns = ['name', 'email', 'created_at', 'average_rating'];
    const sortColumn = validSortColumns.includes(sort as string) ? sort : 'created_at';
    const sortOrder = (order as string).toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    queryStr += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(parseInt(limit as string), offset);

    const storesResult = await pool.query(queryStr, queryParams);

    res.json({
      stores: storesResult.rows,
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
