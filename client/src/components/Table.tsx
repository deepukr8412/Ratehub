import React from 'react';
import styles from './Table.module.scss';

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <table className={styles.table}>{children}</table>
  );
};

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <thead className={styles.thead}>{children}</thead>;
};

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody className={styles.tbody}>{children}</tbody>;
};

export const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tr className={styles.tr}>{children}</tr>;
};

export const TableHeader: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ children, onClick, className = '' }) => {
  return (
    <th className={`${styles.th} ${onClick ? styles.sortable : ''} ${className}`} onClick={onClick}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement> & { children: React.ReactNode; className?: string }> = ({ children, className = '', ...props }) => {
  return <td className={`${styles.td} ${className}`} {...props}>{children}</td>;
};

