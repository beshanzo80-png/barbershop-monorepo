'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '../atoms';

interface BottomNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number | string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export function BottomNavItem({ icon, label, active, badge, onClick, href, disabled }: BottomNavItemProps) {
  const isActive = active;
  
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          'flex flex-col items-center justify-center gap-1 px-2 py-1.5 flex-1',
          'transition-all duration-200',
          isActive
            ? 'text-gold-primary'
            : 'text-text-muted hover:text-text-secondary',
          disabled && 'opacity-50 pointer-events-none'
        )}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
      >
        <span className="relative" aria-hidden="true">
          {icon}
          {badge && (
            <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[16px] h-5 px-1">
              {badge}
            </Badge>
          )}
        </span>
        <span className="text-[10px] font-medium">{label}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-2 py-1.5 flex-1',
        'transition-all duration-200',
        isActive
          ? 'text-gold-primary'
          : 'text-text-muted hover:text-text-secondary',
        disabled && 'opacity-50 pointer-events-none'
      )}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
      aria-pressed={isActive}
    >
      <span className="relative" aria-hidden="true">
        {icon}
        {badge && (
          <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[16px] h-5 px-1">
            {badge}
          </Badge>
        )}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}