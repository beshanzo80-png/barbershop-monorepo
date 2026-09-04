'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../atoms';

interface TimeSlotProps {
  time: string; // "14:30"
  selected?: boolean;
  available?: boolean;
  onSelect?: (time: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export function TimeSlot({ time, selected, available = true, onSelect, disabled, variant = 'default' }: TimeSlotProps) {
  const handleClick = () => {
    if (available && !disabled && onSelect) {
      onSelect(time);
    }
  };

  const isDisabled = disabled || !available;

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
          selected
            ? 'bg-gold-primary text-text-on-gold shadow-gold'
            : available
            ? 'bg-bg-tertiary text-text-primary border border-border-default hover:bg-bg-elevated hover:border-border-focus'
            : 'bg-bg-secondary text-text-muted border border-border-subtle cursor-not-allowed'
        )}
        aria-pressed={selected}
        aria-disabled={isDisabled}
      >
        {time}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'relative flex flex-col items-center justify-center min-w-[60px] h-20 rounded-lg border-2 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        selected
          ? 'bg-gold-primary border-gold-primary text-text-on-gold shadow-gold'
          : available
          ? 'bg-bg-tertiary border-border-default text-text-primary hover:bg-bg-elevated hover:border-gold-primary/50'
          : 'bg-bg-secondary border-border-subtle text-text-muted cursor-not-allowed'
      )}
      aria-pressed={selected}
      aria-disabled={isDisabled}
    >
      <span className="font-medium">{time}</span>
      {!available && !selected && (
        <Badge variant="error" size="sm" className="mt-1">
          Dolu
        </Badge>
      )}
      {selected && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-primary flex items-center justify-center">
          <svg className="w-3 h-3 text-text-on-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
}