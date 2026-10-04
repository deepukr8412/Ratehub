import { Request, Response } from 'express';
import { auth } from '../config/firebase';
import { pool } from '../database/db';

export const syncUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user exists
    const existingUser = await pool.query('SELECT id, name, email, role FROM users WHERE firebase_uid = $1', [decodedToken.uid]);
    
    if (existingUser.rows.length > 0) {
      return res.json(existingUser.rows[0]);
    }

    // Create new user for Google Sign-in
    const result = await pool.query(
      'INSERT INTO users (name, email, role, firebase_uid) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown User', decodedToken.email, 'USER', decodedToken.uid]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
