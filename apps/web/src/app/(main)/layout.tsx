'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@barbershop/ui';
import { useAuthStore } from '@barbershop/web-hooks';

const NAV_ITEMS = [
  { id: 'home', href: '/', label: 'Ana Sayfa' },
  { id: 'appointments', href: '/appointments', label: 'Randevularım' },
  { id: 'services', href: '/services', label: 'Hizmetler' },
  { id: 'profile', href: '/profile', label: 'Profil' },
  { id: 'settings', href: '/settings', label: 'Ayarlar' },
] as const;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const getActiveTab = (path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/appointments')) return 'appointments';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab(pathname);

  const handleTabChange = (tab: string) => {
    const paths: Record<string, string> = {
      home: '/',
      appointments: '/appointments',
      services: '/services',
      profile: '/profile',
      settings: '/settings',
    };
    
    window.location.href = paths[tab] || '/';
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="pb-24 safe-area-inset-bottom:pb-safe">
        {children}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badgeCounts={{
          appointments: 0,
        }}
      />
    </div>
  );
}