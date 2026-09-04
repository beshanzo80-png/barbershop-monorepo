'use client';

import * as React from 'react';
import { ServiceCard } from '../molecules';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../atoms';
import { cn } from '../../lib/utils';
import { Filter, Star } from 'lucide-react';
import type { Service, ServiceCategory } from '@barbershop/types';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string, selected: boolean) => void;
  favorites?: string[];
  category?: ServiceCategory;
  onCategoryChange?: (category: ServiceCategory) => void;
  multiSelect?: boolean;
  maxSelection?: number;
}

const CATEGORIES: { value: ServiceCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'HAIRCUT', label: 'Saç', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  { value: 'BEARD', label: 'Sakal', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
  { value: 'COLORING', label: 'Boya', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17a.002.002 0 01-.002-.002L7 17z" /></svg> },
  { value: 'TREATMENT', label: 'Bakım', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { value: 'PACKAGE', label: 'Paketler', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  { value: 'KIDS', label: 'Çocuk', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
];

export function ServiceSelector({ 
  services, 
  selectedServices, 
  onServiceToggle, 
  favorites = [],
  category,
  onCategoryChange,
  multiSelect = true,
  maxSelection 
}: ServiceSelectorProps) {
  const [activeCategory, setActiveCategory] = React.useState<ServiceCategory>(category || 'HAIRCUT');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredServices = services.filter((service) => {
    const matchesCategory = !category || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && service.isActive;
  });

  // Sort: favorites first, then by sortOrder
  const sortedServices = [...filteredServices].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const isSelected = (serviceId: string) => selectedServices.includes(serviceId);
  const isMaxReached = maxSelection && selectedServices.length >= maxSelection;

  const handleToggle = (serviceId: string) => {
    const currentlySelected = isSelected(serviceId);
    
    if (!currentlySelected && isMaxReached) {
      return; // Prevent selection if max reached
    }
    
    onServiceToggle(serviceId, !currentlySelected);
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger 
              key={cat.value} 
              value={cat.value}
              className="gap-1.5 px-3 py-1.5 min-w-[80px]"
            >
              {cat.icon}
              <span>{cat.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Hizmet ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary focus:border-transparent"
              aria-label="Hizmet ara"
            />
          </div>

          {/* Services Grid */}
          <div className="space-y-2">
            {sortedServices.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p>Bu kategoride hizmet bulunamadı</p>
              </div>
            ) : (
              sortedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={isSelected(service.id)}
                  onSelect={handleToggle}
                  showCategory={!category}
                  variant={multiSelect ? 'default' : 'compact'}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-gold-subtle/50 border border-gold-primary/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gold-dark">Seçili Hizmetler ({selectedServices.length})</span>
            {multiSelect && maxSelection && selectedServices.length >= maxSelection && (
              <span className="text-xs text-warning">Maksimum seçim sayısına ulaşıldı</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedServices.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              if (!service) return null;
              return (
                <span key={serviceId} className="inline-flex items-center gap-1 px-2 py-1 bg-gold-primary/10 text-gold-dark rounded-full text-xs">
                  {service.name}
                  <button
                    type="button"
                    onClick={() => onServiceToggle(serviceId, false)}
                    className="p-0.5 hover:bg-gold-primary/20 rounded-full"
                    aria-label={`${service.name} hizmetini kaldır`}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}