import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'var(--color-slate-100)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <Icon size={28} color="var(--color-slate-400)" />
      </div>
      <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{title}</p>
      <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', maxWidth: '300px' }}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
