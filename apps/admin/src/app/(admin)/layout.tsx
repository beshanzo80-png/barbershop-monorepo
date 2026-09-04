'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@barbershop/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  UserCheck, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@barbershop/ui';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Randevular', icon: Calendar },
  { href: '/barbers', label: 'Berberler', icon: UserCheck },
  { href: '/services', label: 'Hizmetler', icon: Scissors },
  { href: '/customers', label: 'Müşteriler', icon: Users },
  { href: '/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="sidebar-layout bg-bg-primary">
      {/* Sidebar */}
      <aside className={cn(
        'sidebar transition-all duration-300 flex-shrink-0',
        collapsed && 'w-20'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-primary flex items-center justify-center flex-shrink-0">
              <Scissors className="w-6 h-6 text-text-on-gold" />
            </div>
            {!collapsed && (
              <span className="font-display text-xl font-bold text-text-primary">Premium Barber</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-text-muted hover:text-gold-primary"
            aria-label={collapsed ? 'Genişlet' : 'Daralt'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigasyon">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'group relative overflow-hidden',
                  isActive
                    ? 'bg-gold-subtle text-gold-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-gold-primary rounded-r-lg" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom - Logout */}
        <div className="p-3 border-t border-border-subtle">
          <button
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors',
              'text-text-secondary hover:text-error hover:bg-error-bg',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Çıkış Yap' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}