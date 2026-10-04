import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--color-text-primary)' }}>{title}</h1>
        {description && <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{description}</p>}
      </div>
      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {action}
        </div>
      )}
    </div>
  );
};
