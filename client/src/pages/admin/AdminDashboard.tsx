import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Users, Store, Star, Activity, BarChart3, Clock } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { KpiCard } from '../../components/KpiCard';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        addToast('Failed to load dashboard statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        <div style={{ height: '40px', width: '200px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-md)' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '140px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-lg)' }}></div>)}
        </div>
      </div>
    );
  }

  const kpiData = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, trend: '+12% this month', trendDirection: 'up' as const, color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)', link: '/admin/users' },
    { title: 'Total Stores', value: stats?.totalStores || 0, icon: Store, trend: '+4% this month', trendDirection: 'up' as const, color: '#10B981', bg: '#ECFDF5', link: '/admin/stores' },
    { title: 'Total Ratings', value: stats?.totalRatings || 0, icon: Star, trend: '+28% this month', trendDirection: 'up' as const, color: '#F59E0B', bg: '#FFFBEB', link: '/admin/stores' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      
      <PageHeader 
        title="Dashboard Overview" 
        description="Monitor system metrics and recent activity."
        action={<span style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> Last updated just now</span>}
      />
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {kpiData.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity Placeholder */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--color-primary-600)" /> Recent Activity
            </h3>
          </div>
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', maxWidth: '250px' }}>
              <Activity size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Activity feed will appear here as users interact with stores.</p>
            </div>
          </div>
        </div>

        {/* Analytics Placeholder */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="var(--color-primary-600)" /> Rating Trends
            </h3>
          </div>
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', maxWidth: '250px' }}>
              <BarChart3 size={48} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Not enough data to display rating trends for this period.</p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .admin-dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
