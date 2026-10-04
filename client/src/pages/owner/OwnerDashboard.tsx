import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Rating } from '../../components/Rating';
import { useToast } from '../../contexts/ToastContext';
import { Store, Star, Users, MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

interface StoreData {
  id: string;
  name: string;
}

interface StatsData {
  totalRatings: number;
  averageRating: string;
}

interface Distribution {
  rating: number;
  count: string;
}

interface RecentRating {
  rating: number;
  created_at: string;
  user_name: string;
}

interface OwnerDashboardData {
  store: StoreData;
  stats: StatsData;
  distribution: Distribution[];
  recentRatings: RecentRating[];
}

export const OwnerDashboard: React.FC = () => {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setData(response.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          addToast("You don't have a store assigned yet.", 'info');
        } else {
          addToast('Failed to load owner dashboard', 'error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [addToast]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        <div style={{ height: '40px', width: '250px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-md)' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1,2].map(i => <div key={i} style={{ height: '240px', backgroundColor: 'var(--color-slate-200)', borderRadius: 'var(--radius-lg)' }}></div>)}
        </div>
      </div>
    );
  }
  
  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EmptyState 
        icon={Store}
        title="No store found"
        description="You don't have a store assigned to your account yet. Please contact an administrator."
      />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      
      <PageHeader 
        title={`${data.store.name} Analytics`}
        description="View your store's performance and recent reviews."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Average Rating Card */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Overall Rating</h3>
          </div>
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
              {data.stats.averageRating}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Rating value={parseFloat(data.stats.averageRating)} readOnly size={32} />
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={16} /> Based on {data.stats.totalRatings} total ratings
            </p>
          </div>
        </div>

        {/* Distribution Card */}
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Rating Distribution</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>
            {[5, 4, 3, 2, 1].map(stars => {
              const distItem = data.distribution.find(d => d.rating === stars);
              const count = distItem ? parseInt(distItem.count) : 0;
              const percentage = data.stats.totalRatings > 0 ? (count / data.stats.totalRatings) * 100 : 0;
              
              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '36px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                    {stars} <Star size={14} fill="currentColor" color="#F59E0B" />
                  </div>
                  <div style={{ flexGrow: 1, backgroundColor: 'var(--color-slate-100)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: stars >= 4 ? '#10B981' : stars === 3 ? '#F59E0B' : '#EF4444', height: '100%', width: `${percentage}%`, borderRadius: '6px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {percentage > 0 ? Math.round(percentage) + '%' : '0%'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Recent Ratings</h3>
        </div>
        <div>
          {data.recentRatings.length === 0 ? (
            <div style={{ padding: '2rem 0' }}>
              <EmptyState 
                icon={MessageSquare} 
                title="No ratings yet" 
                description="Your store hasn't received any ratings. They will appear here once users review your store." 
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {data.recentRatings.map((rating, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: idx !== data.recentRatings.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {rating.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{rating.user_name}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{new Date(rating.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <div>
                    <Rating value={rating.rating} readOnly size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
