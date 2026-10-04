import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: string;
  bg?: string;
  link?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, trendDirection = 'up', color = 'var(--color-primary-600)', bg = 'var(--color-primary-50)', link }) => {
  const isPositive = trendDirection === 'up';
  const isNegative = trendDirection === 'down';
  
  return (
    <div style={{ 
      backgroundColor: 'var(--color-surface)', 
      borderRadius: 'var(--radius-lg)', 
      border: '1px solid var(--color-border)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 0' }}>{title}</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, lineHeight: 1, color: 'var(--color-text-primary)' }}>{value}</h3>
        </div>
        <div style={{ backgroundColor: bg, color: color, padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
          <Icon size={28} strokeWidth={2.5} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        {trend && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: isPositive ? '#10B981' : isNegative ? '#EF4444' : 'var(--color-text-tertiary)', fontWeight: 500 }}>
            {isPositive ? <TrendingUp size={16} /> : isNegative ? <TrendingDown size={16} /> : null} {trend}
          </span>
        )}
        {link && (
          <Link to={link} style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
            View <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};
