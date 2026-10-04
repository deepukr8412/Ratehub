import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './Rating.module.scss';

interface RatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({ value, onChange, readOnly = false, size = 24 }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverValue(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!readOnly && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(index);
    }
  };

  return (
    <div className={styles.container} role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = hoverValue !== null ? index <= hoverValue : index <= value;
        const isHovered = hoverValue !== null && index <= hoverValue;

        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={index === value}
            aria-disabled={readOnly}
            tabIndex={readOnly ? -1 : 0}
            className={`${styles.star} ${isFilled ? styles.filled : ''} ${isHovered ? styles.hovered : ''} ${readOnly ? styles.readonly : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <Star size={size} fill={isFilled ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
};
