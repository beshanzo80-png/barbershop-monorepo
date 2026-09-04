'use client';

import * as React from 'react';
import { Card, CardContent } from '../atoms';
import { Badge } from '../atoms';
import { Checkbox } from '../atoms';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDuration } from '@barbershop/utils';
import type { Service, ServiceCategory } from '@barbershop/types';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect?: (serviceId: string, selected: boolean) => void;
  showCategory?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  HAIRCUT: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  BEARD: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  COLORING: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a.002.002 0 01-.002-.002L7 17z" /></svg>,
  TREATMENT: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  PACKAGE: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  KIDS: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
};

const categoryLabels: Record<ServiceCategory, string> = {
  HAIRCUT: 'Saç Kesimi',
  BEARD: 'Sakal',
  COLORING: 'Boya',
  TREATMENT: 'Bakım',
  PACKAGE: 'Paketler',
  KIDS: 'Çocuk',
};

export function ServiceCard({ service, selected, onSelect, showCategory = true, variant = 'default' }: ServiceCardProps) {
  const handleChange = (checked: boolean) => {
    onSelect?.(service.id, checked);
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 p-3 rounded-lg transition-all', selected ? 'bg-gold-subtle border border-gold-primary' : 'bg-bg-secondary border border-border-subtle hover:border-border-default')}>
        <Checkbox checked={selected} onCheckedChange={handleChange} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{service.name}</p>
          <p className="text-xs text-text-muted flex items-center gap-2">
            <span>{formatDuration(service.duration)}</span>
            <span>•</span>
            <span>{formatCurrency(service.price)}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        selected && 'border-gold-primary shadow-gold bg-gold-subtle/30'
      )}
    >
      {selected && (
        <div className="absolute inset-0 bg-gold-primary/5 pointer-events-none" />
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={selected} 
            onCheckedChange={handleChange} 
            className="flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-text-primary">{service.name}</h3>
                {showCategory && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-gold-primary">{categoryIcons[service.category]}</span>
                    <Badge variant="outline" size="sm">{categoryLabels[service.category]}</Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-lg font-bold text-gold-primary">{formatCurrency(service.price)}</span>
                <span className="text-xs text-text-muted">{formatDuration(service.duration)}</span>
              </div>
            </div>
            {service.description && variant === 'detailed' && (
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">{service.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}