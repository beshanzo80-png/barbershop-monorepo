'use client';

import * as React from 'react';
import { ServiceSelector } from '@barbershop/ui';
import { Button } from '@barbershop/ui';
import { Scissors, Sparkles } from 'lucide-react';
import { useServices } from '@barbershop/web-hooks';
import { useBookingStore } from '@barbershop/web-hooks';

const MOCK_SERVICES = [
  { id: '1', name: 'Saç Kesimi', description: 'Klasik veya modern saç kesimi, şekillendirme ve fınış', duration: 30, price: 150, category: 'HAIRCUT' as const, sortOrder: 1, isActive: true },
  { id: '2', name: 'Sakal Tıraşı', description: 'Geleneksel usta tıraşı, sıcak bez ile cilt bakımı', duration: 20, price: 80, category: 'BEARD' as const, sortOrder: 2, isActive: true },
  { id: '3', name: 'Saç + Sakal Kombo', description: 'Saç kesimi ve sakal tıraşı paketi', duration: 45, price: 200, category: 'PACKAGE' as const, sortOrder: 3, isActive: true },
  { id: '4', name: 'Saç Boyama', description: 'Profesyonel saç boyama (kök/tam)', duration: 45, price: 180, category: 'COLORING' as const, sortOrder: 4, isActive: true },
  { id: '5', name: 'Sakal Boyama', description: 'Doğal görünümde sakal boyama', duration: 15, price: 60, category: 'COLORING' as const, sortOrder: 5, isActive: true },
  { id: '6', name: 'Cilt Bakımı', description: 'Derin temizlik, peeling, mask ve nemlendirme', duration: 25, price: 120, category: 'TREATMENT' as const, sortOrder: 6, isActive: true },
  { id: '7', name: 'Kaş Düzenleme', description: 'Kaş şekillendirme ve tıraş', duration: 10, price: 40, category: 'TREATMENT' as const, sortOrder: 7, isActive: true },
  { id: '8', name: 'Çocuk Kesimi (0-12 yaş)', description: 'Çocuklara özel saç kesimi', duration: 20, price: 100, category: 'KIDS' as const, sortOrder: 8, isActive: true },
];

export default function ServicesPage() {
  const { services: selectedServices } = useBookingStore();
  const { data: services, isLoading } = useServices();

  // Use mock data for demo
  const displayServices = services || MOCK_SERVICES;

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Hizmetlerimiz</h1>
        <p className="text-text-secondary mt-1">Profesyonel berberlerimiz tarafından sunulan tüm hizmetler</p>
      </div>

      <ServiceSelector
        services={displayServices}
        selectedServices={selectedServices}
        onServiceToggle={(id, selected) => {
          // This would be handled by the booking store in real app
        }}
        multiSelect={true}
        maxSelection={5}
      />

      {selectedServices.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 md:bottom-24 md:left-auto md:right-4 md:w-80 z-50">
          <Button 
            className="w-full" 
            size="lg" 
            asChild
            variant="gold"
          >
            <a href="/booking">
              <Sparkles className="h-5 w-5 mr-2" />
              Randevuya Devam Et ({selectedServices.length})
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}