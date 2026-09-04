'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { BottomNavigation } from '@barbershop/ui';
import { 
  Home, 
  Calendar, 
  Scissors, 
  User, 
  Settings 
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@barbershop/web-hooks';

export default function HomePage() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  // Determine active tab from pathname
  const getActiveTab = (path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/appointments')) return 'appointments';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab(pathname);

  // Protected routes that require authentication
  const protectedTabs = ['appointments', 'profile', 'settings'];

  const handleTabChange = (tab: string) => {
    if (protectedTabs.includes(tab) && !isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = `/auth/login?redirect=/${tab}`;
      return;
    }
    
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
      {/* Main content area - pages will render here via Next.js layout */}
      <main className="pb-24 safe-area-inset-bottom:pb-safe">
        {React.useId()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badgeCounts={{
          appointments: 0, // Could be fetched from notifications store
        }}
      />
    </div>
  );
}