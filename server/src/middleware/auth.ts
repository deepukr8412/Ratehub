import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { pool } from '../database/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    uid: string;
    role: 'ADMIN' | 'USER' | 'STORE_OWNER';
    email: string;
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Find user in database based on Firebase UID
    const result = await pool.query('SELECT id, firebase_uid, role, email FROM users WHERE firebase_uid = $1', [decodedToken.uid]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found in database' });
    }

    const user = result.rows[0];
    req.user = {
      id: user.id,
      uid: user.firebase_uid,
      role: user.role,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};
