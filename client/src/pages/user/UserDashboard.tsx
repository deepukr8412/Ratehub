import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Rating } from '../../components/Rating';
import { Button } from '../../components/Button';
import { useToast } from '../../contexts/ToastContext';
import { Search, MapPin, Store as StoreIcon, Star } from 'lucide-react';
import { EmptyState } from '../../components/EmptyState';

interface Store {
  id: string;
  name: string;
  address: string;
  average_rating: string;
  total_ratings: string;
}

export const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // Track user's ratings. Map of storeId -> rating (number)
  const [userRatings, setUserRatings] = useState<Record<string, number | null>>({});
  
  const { addToast } = useToast();
  const limit = 12;

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/stores', {
        params: { page, limit, search }
      });
      setStores(response.data.stores);
      setTotal(response.data.total);

      // Fetch user's rating for these specific stores
      response.data.stores.forEach(async (store: Store) => {
        try {
          const ratingRes = await api.get(`/stores/${store.id}/rating`);
          setUserRatings(prev => ({ ...prev, [store.id]: ratingRes.data.rating }));
        } catch (e) {
          // ignore individual fetch errors
        }
      });
    } catch (error) {
      console.error(error);
      addToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, limit, addToast]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchStores]);

  const handleRatingChange = async (storeId: string, newRating: number) => {
    try {
      await api.post(`/stores/${storeId}/rating`, { rating: newRating });
      setUserRatings(prev => ({ ...prev, [storeId]: newRating }));
      addToast('Rating submitted successfully!', 'success');
      // Refetch to update average
      fetchStores();
    } catch (error) {
      addToast('Failed to submit rating', 'error');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '1rem auto 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
          Discover and rate <span style={{ color: 'var(--color-primary-600)' }}>great stores</span>
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', margin: 0, maxWidth: '600px' }}>
          Find the best places in town based on authentic community reviews. Share your own experiences.
        </p>
        
        <div style={{ width: '100%', maxWidth: '600px', position: 'relative', marginTop: '1rem' }}>
          <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>
            <Search size={22} />
          </div>
          <input 
            type="text"
            placeholder="Search stores by name or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1.25rem 1.25rem 1.25rem 3.5rem', 
              fontSize: '1rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--color-border)', 
              boxShadow: 'var(--shadow-sm)',
              outline: 'none',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-500)'; e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
          />
        </div>
      </div>

      {loading && stores.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: '260px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {stores.map(store => (
            <div key={store.id} style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{store.name}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                      {store.address}
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <StoreIcon size={24} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
                  <Rating value={parseFloat(store.average_rating)} readOnly size={18} />
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{store.average_rating ? parseFloat(store.average_rating).toFixed(1) : 'New'}</span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>({store.total_ratings} ratings)</span>
                </div>
              </div>

              <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, color: userRatings[store.id] ? 'var(--color-primary-600)' : 'var(--color-text-secondary)' }}>
                    {userRatings[store.id] ? 'Your Rating' : 'Tap to rate'}
                  </p>
                  {userRatings[store.id] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#10B981', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '0.125rem 0.5rem', borderRadius: '1rem' }}>
                      <Star size={12} fill="currentColor" /> Rated {userRatings[store.id]}
                    </div>
                  )}
                </div>
                <Rating 
                  value={userRatings[store.id] || 0} 
                  onChange={(r) => handleRatingChange(store.id, r)}
                  size={24}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {stores.length === 0 && !loading && (
        <div style={{ padding: '4rem 0' }}>
          <EmptyState 
            icon={Search}
            title="No stores found"
            description={`We couldn't find any stores matching "${search}".`}
          />
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem 1rem' }}>
            Previous
          </Button>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Page <span style={{ color: 'var(--color-text-primary)' }}>{page}</span> of {totalPages}
          </div>
          <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '0.5rem 1rem' }}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
