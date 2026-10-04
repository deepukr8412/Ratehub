import { Request, Response } from 'express';
import { pool } from '../database/db';
import { auth } from '../config/firebase';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, address, role, password } = req.body;
    
    // Basic validation
    if (!name || !email || !role || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ success: false, message: 'Name must be 20-60 characters' });
    }

    // Password validation: 8-16 chars, 1 uppercase, 1 special
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be 8-16 characters, containing at least one uppercase letter and one special character' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create Firebase User
    let firebaseUser;
    try {
      firebaseUser = await auth.createUser({
        email,
        password,
        displayName: name,
      });
    } catch (firebaseError: any) {
      console.error('Firebase Error:', firebaseError);
      return res.status(400).json({ success: false, message: firebaseError.message || 'Failed to create user in Firebase' });
    }

    // Create User in DB
    const result = await pool.query(
      'INSERT INTO users (name, email, address, role, firebase_uid) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, address, role, firebaseUser.uid]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, email, address, owner_id } = req.body;
    
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ success: false, message: 'Name must be 20-60 characters' });
    }

    if (address.length > 400) {
      return res.status(400).json({ success: false, message: 'Address must be maximum 400 characters' });
    }

    // Check if owner exists and is a store owner
    const ownerResult = await pool.query('SELECT role FROM users WHERE id = $1', [owner_id]);
    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }
    
    if (ownerResult.rows[0].role !== 'STORE_OWNER') {
      return res.status(400).json({ success: false, message: 'Selected user is not a STORE_OWNER' });
    }

    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
