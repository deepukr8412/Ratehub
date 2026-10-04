import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, Home, Users, Store, LogOut, Bell, Moon, Sun, LayoutDashboard } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (!user) return <>{children}</>;

  const getNavLinks = () => {
    if (user.role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/stores', label: 'Stores', icon: Store },
      ];
    }
    if (user.role === 'STORE_OWNER') {
      return [
        { path: '/owner/dashboard', label: 'Store Dashboard', icon: LayoutDashboard },
      ];
    }
    return [
      { path: '/dashboard', label: 'Discover', icon: Home },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }}
          className="md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside 
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50, width: '260px',
          backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
          display: 'flex', flexDirection: 'column',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="sidebar-responsive"
      >
        <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 var(--spacing-6)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>RateHub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="close-btn" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.75rem', marginBottom: '0.25rem' }}>
            Main Menu
          </div>
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link 
                key={link.path} to={link.path} onClick={() => setIsSidebarOpen(false)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: 'var(--radius-md)', 
                  color: isActive ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                  backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                  fontWeight: isActive ? 600 : 500, transition: 'all 0.2s'
                }}
                className="nav-link"
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate-600)', fontWeight: 600, fontSize: '0.875rem' }}>
              {user.name?.charAt(0) || 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'capitalize' }}>{user.role.replace('_', ' ').toLowerCase()}</div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s' }} className="main-content-responsive">
        {/* Top Navbar */}
        <header style={{ height: '64px', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--spacing-6)', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setIsSidebarOpen(true)} className="menu-btn" style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              {navLinks.find(l => location.pathname.startsWith(l.path))?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }} className="icon-btn">
              <Bell size={20} />
            </button>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }} className="icon-btn">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem' }}></div>
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '0.5rem', fontWeight: 500, transition: 'color 0.2s' }} className="logout-btn">
              <LogOut size={18} />
              <span className="hide-on-mobile">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 'var(--spacing-6)', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .sidebar-responsive { transform: translateX(0) !important; }
          .main-content-responsive { margin-left: 260px; }
          .menu-btn { display: none !important; }
          .close-btn { display: none !important; }
        }
        .nav-link:hover {
          background-color: var(--color-slate-100) !important;
          color: var(--color-slate-900) !important;
        }
        [data-theme='dark'] .nav-link:hover {
          background-color: var(--color-slate-800) !important;
          color: var(--color-slate-50) !important;
        }
        .icon-btn:hover { background-color: var(--color-slate-100); }
        [data-theme='dark'] .icon-btn:hover { background-color: var(--color-slate-800); }
        .logout-btn:hover { color: var(--color-error) !important; }
        @media (max-width: 640px) {
          .hide-on-mobile { display: none; }
        }
      `}</style>
    </div>
  );
};
