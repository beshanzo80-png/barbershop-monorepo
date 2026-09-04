'use client';

import * as React from 'react';
import { BarberCard } from '../molecules';
import { cn } from '@/lib/utils';
import { Wifi, Star, Clock, MapPin } from 'lucide-react';
import type { Barber } from '@barbershop/types';

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId?: string;
  onBarberSelect: (barberId: string) => void;
  showAvailability?: boolean;
  variant?: 'grid' | 'list' | 'carousel';
  favorites?: string[];
  loading?: boolean;
}

export function BarberSelector({ 
  barbers, 
  selectedBarberId, 
  onBarberSelect, 
  showAvailability = true,
  variant = 'grid',
  favorites = [],
  loading 
}: BarberSelectorProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-bg-tertiary rounded-lg mb-3" />
            <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2" />
            <div className="h-3 bg-bg-tertiary rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="text-center py-12">
        <Wifi className="h-12 w-12 mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-1">Müsait Berber Bulunamadı</h3>
        <p className="text-text-secondary">Seçilen tarih ve saatte müsait berber yok. Başka bir zaman deneyin.</p>
      </div>
    );
  }

  // Sort: favorites first, then by rating
  const sortedBarbers = [...barbers].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return b.rating - a.rating;
  });

  if (variant === 'carousel') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">Berber Seçin</h3>
          {favorites.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gold-primary">
              <Star className="h-3 w-3 fill-current" />
              {favorites.length} favori
            </span>
          )}
        </div>
        <div className="overflow-x-auto pb-4 -mx-4 px-4 snap-x flex gap-3">
          {sortedBarbers.map((barber) => (
            <div key={barber.id} className="flex-shrink-0 w-48 sm:w-56 snap-center">
              <BarberCard
                barber={barber}
                selected={selectedBarberId === barber.id}
                onSelect={onBarberSelect}
                variant="compact"
                showRating={true}
                available={showAvailability ? true : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {sortedBarbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            selected={selectedBarberId === barber.id}
            onSelect={onBarberSelect}
            variant="list"
            showRating={true}
            available={showAvailability ? true : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedBarbers.map((barber) => (
        <BarberCard
          key={barber.id}
          barber={barber}
          selected={selectedBarberId === barber.id}
          onSelect={onBarberSelect}
          variant="default"
          showRating={true}
          available={showAvailability ? true : undefined}
        />
      ))}
    </div>
  );
}