'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-bg-tertiary border border-border-default rounded-md text-text-primary placeholder-text-muted',
            'transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent',
            'disabled:bg-bg-secondary disabled:text-text-muted disabled:cursor-not-allowed',
            'aria-invalid:focus:ring-error aria-invalid:focus:border-error',
            'py-2.5 px-3 text-sm min-h-[80px]',
            error && 'border-error focus:ring-error',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea };