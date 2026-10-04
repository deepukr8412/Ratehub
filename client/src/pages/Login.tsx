import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard based on role
  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      addToast('Successfully signed in with Google', 'success');
      // The AuthContext onAuthStateChanged listener will handle the sync and redirect
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Failed to sign in', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      {/* Left side: Branding & Visuals (Hidden on small screens) */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: 'var(--spacing-12)',
          background: 'linear-gradient(135deg, var(--color-slate-900) 0%, var(--color-slate-800) 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="login-left-panel"
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--spacing-8)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>RateHub</h1>
          </div>
          
          <h2 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Discover. <br/>
            Rate. <br/>
            <span style={{ color: 'var(--color-primary-400)' }}>Decide.</span>
          </h2>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--color-slate-300)', lineHeight: 1.6, maxWidth: '400px' }}>
            The premier platform for authentic store reviews and powerful customer insights.
          </p>
        </div>

        {/* Abstract decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)', opacity: 0.15, filter: 'blur(40px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(40px)' }}></div>
      </div>

      {/* Right side: Auth Panel */}
      <div 
        style={{ 
          flex: '0 0 100%', 
          maxWidth: '560px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: 'var(--spacing-12) var(--spacing-8)',
          backgroundColor: 'var(--color-surface)'
        }}
        className="login-right-panel"
      >
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Welcome back</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Please enter your details to sign in.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleGoogleLogin} 
              isLoading={isLoading}
              style={{ width: '100%', display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', padding: '0.875rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 500, borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { max-width: 100% !important; flex: 1 !important; }
        }
      `}</style>
    </div>
  );
};
