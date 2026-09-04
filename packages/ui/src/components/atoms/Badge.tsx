'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gold-subtle text-gold-primary border border-gold-primary/30',
        primary: 'bg-gold-primary text-text-on-gold',
        secondary: 'bg-bg-tertiary text-text-primary border border-border-default',
        success: 'bg-success-bg text-success border border-success/30',
        warning: 'bg-warning-bg text-warning border border-warning/30',
        error: 'bg-error-bg text-error border border-error/30',
        info: 'bg-info-bg text-info border border-info/30',
        outline: 'bg-transparent text-text-secondary border border-border-default',
        gold: 'bg-gold-primary text-text-on-gold',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };