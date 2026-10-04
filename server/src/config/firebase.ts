import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount: ServiceAccount | undefined;

try {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '{}';
  const parsed = JSON.parse(raw);
  if (parsed.project_id) {
    serviceAccount = parsed as ServiceAccount;
  }
} catch (error) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env variable', error);
}

if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.warn('Firebase Admin SDK initialized without service account credentials. Set FIREBASE_SERVICE_ACCOUNT in .env');
    initializeApp();
  }
}

export const auth = getAuth();
