import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table';
import { Button } from '../../components/Button';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Search, Store, ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

interface StoreData {
  id: string;
  name: string;
  email: string;
  address: string;
  owner_name: string;
  average_rating: string;
  created_at: string;
}

export const AdminStores: React.FC = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  
  const { addToast } = useToast();
  const limit = 10;

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stores', {
        params: { page, limit, search, sort, order }
      });
      setStores(response.data.stores);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
      addToast('Failed to load stores', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, order, addToast]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchStores]);

  const handleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setOrder('asc');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '2rem' }}>
      
      <PageHeader 
        title="Stores" 
        description="Manage stores on the platform."
        action={<Button onClick={() => addToast('Create store flow goes here', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18} /> Add Store</Button>}
      />

      {/* Filters and Table wrapper */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Search by store name, email, or address..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {loading && stores.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              Loading stores...
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader onClick={() => handleSort('name')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Store Name {sort === 'name' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('address')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Address {sort === 'address' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader>Owner</TableHeader>
                  <TableHeader onClick={() => handleSort('average_rating')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Rating {sort === 'average_rating' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('created_at')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Created Date {sort === 'created_at' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map(store => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Store size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{store.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{store.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{store.address}</span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>{store.owner_name}</span>
                    </TableCell>
                    <TableCell>
                      {store.average_rating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#FFFBEB', color: '#B45309', borderRadius: '1rem', width: 'fit-content', fontSize: '0.875rem', fontWeight: 600 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          {parseFloat(store.average_rating).toFixed(1)}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', fontStyle: 'italic' }}>No ratings</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(store.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {stores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <EmptyState 
                        icon={Search} 
                        title="No stores found" 
                        description="We couldn't find any stores matching your criteria." 
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        
        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Showing <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{(page - 1) * limit + 1}</span> to <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{Math.min(page * limit, total)}</span> of <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{total}</span> results
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
