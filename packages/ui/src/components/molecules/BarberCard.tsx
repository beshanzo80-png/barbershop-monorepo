'use client';

import * as React from 'react';
import { Card, CardContent } from '../atoms';
import { Badge } from '../atoms';
import { Avatar, AvatarImage, AvatarFallback } from '../atoms';
import { cn } from '@/lib/utils';
import { formatDuration } from '@barbershop/utils';
import { Star } from 'lucide-react';
import type { Barber } from '@barbershop/types';

interface BarberCardProps {
  barber: Barber;
  selected?: boolean;
  onSelect?: (barberId: string) => void;
  showRating?: boolean;
  variant?: 'default' | 'compact' | 'list';
  available?: boolean;
}

export function BarberCard({ barber, selected, onSelect, showRating = true, variant = 'default', available = true }: BarberCardProps) {
  const handleClick = () => {
    onSelect?.(barber.id);
  };

  const initials = barber.user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={!available}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all',
          selected ? 'bg-gold-subtle border border-gold-primary' : 'bg-bg-secondary border border-border-subtle hover:border-border-default',
          !available && 'opacity-50 cursor-not-allowed'
        )}
        aria-pressed={selected}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={barber.user.avatar || undefined} alt={barber.user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary truncate">{barber.user.name}</p>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            {showRating && barber.rating > 0 && (
              <>
                <Star className="h-3 w-3 fill-current text-warning" />
                <span>{barber.rating.toFixed(1)}</span>
              </>
            )}
            <span>•</span>
            <span>{barber.experienceYears} yıl deneyim</span>
            {!available && <Badge variant="error" size="sm">Müsait Değil</Badge>}
          </div>
        </div>
        {selected && <div className="w-5 h-5 rounded-full border-2 border-gold-primary flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-gold-primary" /></div>}
      </button>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('flex items-center gap-4 p-3 rounded-lg transition-all', selected && 'bg-gold-subtle border border-gold-primary')}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={barber.user.avatar || undefined} alt={barber.user.name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">{barber.user.name}</h3>
            {showRating && barber.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-warning" />
                <span className="font-medium">{barber.rating.toFixed(1)}</span>
                <span className="text-text-muted">({barber.reviewCount})</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {barber.specialties.slice(0, 3).map((spec, i) => (
              <Badge key={i} variant="outline" size="sm">{spec}</Badge>
            ))}
            {barber.specialties.length > 3 && (
              <Badge variant="outline" size="sm">+{barber.specialties.length - 3} daha</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={available ? 'success' : 'error'} size="md">
            {available ? 'Müsait' : 'Müsait Değil'}
          </Badge>
          <span className="text-xs text-text-muted">{barber.experienceYears} yıl deneyim</span>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        'relative overflow-hidden transition-all duration-200 cursor-pointer',
        selected && 'border-gold-primary shadow-gold bg-gold-subtle/30',
        !available && 'opacity-60'
      )}
      onClick={handleClick}
    >
      {selected && <div className="absolute inset-0 bg-gold-primary/5 pointer-events-none" />}
      <CardContent className="p-4">
        <div className="text-center">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarImage src={barber.user.avatar || undefined} alt={barber.user.name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-text-primary">{barber.user.name}</h3>
          {showRating && barber.rating > 0 && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-current text-warning" />
              <span className="font-medium">{barber.rating.toFixed(1)}</span>
              <span className="text-text-muted text-sm">({barber.reviewCount} değerlendirme)</span>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {barber.specialties.slice(0, 4).map((spec, i) => (
              <Badge key={i} variant="outline" size="sm">{spec}</Badge>
            ))}
            {barber.specialties.length > 4 && (
              <Badge variant="outline" size="sm">+{barber.specialties.length - 4} daha</Badge>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle">
            <Badge variant={available ? 'success' : 'error'} className="w-full">
              {available ? 'Müsait' : 'Müsait Değil'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}