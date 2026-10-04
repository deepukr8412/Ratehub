import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminStores } from './pages/admin/AdminStores';
import { UserDashboard } from './pages/user/UserDashboard';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={user.role === 'ADMIN' ? <AdminUsers /> : <Navigate to="/login" />} />
        <Route path="/admin/stores" element={user.role === 'ADMIN' ? <AdminStores /> : <Navigate to="/login" />} />

        {/* Owner Route */}
        <Route path="/owner/dashboard" element={user.role === 'STORE_OWNER' ? <OwnerDashboard /> : <Navigate to="/login" />} />
        
        {/* Normal User Route */}
        <Route path="/dashboard" element={user.role === 'USER' ? <UserDashboard /> : <Navigate to="/login" />} />
        
        <Route path="/" element={<Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'STORE_OWNER' ? '/owner/dashboard' : '/dashboard'} />} />
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 Not Found</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>The page you are looking for does not exist.</p>
          </div>
        } />
      </Routes>
    </AppShell>
  );
}

export default App;

