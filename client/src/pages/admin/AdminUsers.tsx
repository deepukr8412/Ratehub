import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/Table';
import { Button } from '../../components/Button';
import { useToast } from '../../contexts/ToastContext';
import { Plus, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { EmptyState } from '../../components/EmptyState';

interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  created_at: string;
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  
  const { addToast } = useToast();
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: { page, limit, search, role, sort, order }
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, sort, order, addToast]);

  useEffect(() => {
    // Debounce search
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchUsers]);

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
        title="Users" 
        description="Manage user accounts, roles and permissions."
        action={<Button onClick={() => addToast('Create user flow goes here', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18} /> Add User</Button>}
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
              placeholder="Search by name, email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '0.75rem', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }}>
                <Filter size={16} />
              </div>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ padding: '0.625rem 2rem 0.625rem 2.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', fontSize: '0.875rem', cursor: 'pointer', appearance: 'none', minWidth: '160px' }}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
              <div style={{ position: 'absolute', right: '0.75rem', pointerEvents: 'none', color: 'var(--color-text-secondary)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {loading && users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid var(--color-border)', borderTopColor: 'var(--color-primary-600)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
              Loading users...
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader onClick={() => handleSort('name')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Name {sort === 'name' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('email')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Email {sort === 'email' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('role')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Role {sort === 'role' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                  <TableHeader onClick={() => handleSort('created_at')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Joined {sort === 'created_at' && (order === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </div>
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <span style={{ 
                        padding: '0.25rem 0.625rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        backgroundColor: user.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'STORE_OWNER' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        color: user.role === 'ADMIN' ? 'var(--color-error)' : user.role === 'STORE_OWNER' ? 'var(--color-warning)' : 'var(--color-primary-600)'
                      }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <EmptyState 
                        icon={Search} 
                        title="No users found" 
                        description="We couldn't find any users matching your criteria." 
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
