'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, iconPosition = 'left', id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;
    
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden="true">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-bg-tertiary border border-border-default rounded-md text-text-primary placeholder-text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent',
              'disabled:bg-bg-secondary disabled:text-text-muted disabled:cursor-not-allowed',
              'aria-invalid:focus:ring-error aria-invalid:focus:border-error',
              iconPosition === 'left' ? 'pl-10' : 'pr-10',
              'py-2.5 px-3 text-sm',
              error && 'border-error focus:ring-error',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-errormessage={errorId}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden="true">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };