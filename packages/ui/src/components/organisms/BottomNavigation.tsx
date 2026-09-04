'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { BottomNavItem } from '../molecules';
import { 
  Home, 
  Calendar, 
  Scissors, 
  User, 
  Settings 
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  badgeCounts?: Record<string, number>;
  className?: string;
}

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Ana Sayfa' },
  { id: 'appointments', icon: Calendar, label: 'Randevular' },
  { id: 'services', icon: Scissors, label: 'Hizmetler' },
  { id: 'profile', icon: User, label: 'Profil' },
  { id: 'settings', icon: Settings, label: 'Ayarlar' },
] as const;

export function BottomNavigation({ activeTab, onTabChange, badgeCounts, className }: BottomNavigationProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[300] bg-bg-elevated border-t border-border-subtle',
        'safe-area-inset-bottom:pb-safe',
        className
      )}
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => (
          <BottomNavItem
            key={item.id}
            icon={<item.icon className="h-6 w-6" aria-hidden="true" />}
            label={item.label}
            active={activeTab === item.id}
            badge={badgeCounts?.[item.id]}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}