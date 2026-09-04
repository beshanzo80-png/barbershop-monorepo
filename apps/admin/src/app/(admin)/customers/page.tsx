'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Avatar, AvatarImage, AvatarFallback,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@barbershop/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search, Filter, User, Mail, Phone, Calendar, Award,
  Star, TrendingUp, TrendingDown, MoreVertical, Edit, Eye
} from 'lucide-react';
import { cn } from '@barbershop/utils';
import { formatDate, formatCurrency, formatRelativeTime } from '@barbershop/utils';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Ali Yılmaz', email: 'ali@example.com', phone: '+905554444444', avatar: null, loyaltyPoints: 350, totalVisits: 5, totalSpent: 850, tier: 'Silver', lastVisit: '2026-09-10', active: true, birthDate: '1990-05-15', marketingConsent: true, favoriteBarber: 'Ahmet Usta' },
  { id: '2', name: 'Veli Demir', email: 'veli@example.com', phone: '+905555555555', avatar: null, loyaltyPoints: 1200, totalVisits: 12, totalSpent: 2400, tier: 'Gold', lastVisit: '2026-09-12', active: true, birthDate: '1985-11-22', marketingConsent: true, favoriteBarber: 'Mehmet Usta' },
  { id: '3', name: 'Mehmet Kaya', email: 'mehmet@example.com', phone: '+905556666666', avatar: null, loyaltyPoints: 50, totalVisits: 1, totalSpent: 150, tier: 'Bronze', lastVisit: '2026-09-08', active: true, birthDate: '1995-03-10', marketingConsent: false, favoriteBarber: null },
  { id: '4', name: 'Ahmet Öz', email: 'ahmet@example.com', phone: '+905557777777', avatar: null, loyaltyPoints: 2100, totalVisits: 22, totalSpent: 4200, tier: 'Platinum', lastVisit: '2026-09-14', active: true, birthDate: '1988-07-25', marketingConsent: true, favoriteBarber: 'Ahmet Usta' },
  { id: '5', name: 'Can Yıldız', email: 'can@example.com', phone: '+905558888888', avatar: null, loyaltyPoints: 0, totalVisits: 0, totalSpent: 0, tier: 'Bronze', lastVisit: null, active: true, birthDate: '1992-12-01', marketingConsent: false, favoriteBarber: null },
  { id: '6', name: 'Burak Şahin', email: 'burak@example.com', phone: '+905559999999', avatar: null, loyaltyPoints: 800, totalVisits: 8, totalSpent: 1650, tier: 'Gold', lastVisit: '2026-09-13', active: true, birthDate: '1993-09-18', marketingConsent: true, favoriteBarber: 'Can Usta' },
];

const TIERS = [
  { name: 'Bronze', minPoints: 0, color: '#CD7F32', icon: '🥉' },
  { name: 'Silver', minPoints: 500, color: '#C0C0C0', icon: '🥈' },
  { name: 'Gold', minPoints: 1500, color: '#D4A843', icon: '🥇' },
  { name: 'Platinum', minPoints: 3000, color: '#E5E4E2', icon: '💎' },
];

function getTierColor(tier: string) {
  return TIERS.find(t => t.name === tier)?.color || '#808080';
}

export default function CustomersPage() {
  const [search, setSearch] = React.useState('');
  const [tierFilter, setTierFilter] = React.useState<'ALL' | string>('ALL');
  const [activeFilter, setActiveFilter] = React.useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = React.useState<typeof MOCK_CUSTOMERS[0] | null>(null);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesActive = activeFilter === 'ALL' || (activeFilter === 'ACTIVE' && c.active) || (activeFilter === 'INACTIVE' && !c.active);
    return matchesSearch && matchesTier && matchesActive;
  });

  const stats = {
    total: MOCK_CUSTOMERS.length,
    active: MOCK_CUSTOMERS.filter(c => c.active).length,
    newThisMonth: MOCK_CUSTOMERS.filter(c => c.lastVisit && c.lastVisit.startsWith('2026-09')).length,
    avgSpent: Math.round(MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0) / MOCK_CUSTOMERS.length),
    totalRevenue: MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Müşteri Yönetimi</h1>
          <p className="text-text-secondary">Müşteri profilleri, sadakat ve geçmişi</p>
        </div>
        <Button variant="outline"><User className="h-4 w-4 mr-2" />Müşteri Ekle</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Toplam Müşteri</p><p className="text-2xl font-bold text-text-primary">{stats.total}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Aktif</p><p className="text-2xl font-bold text-success">{stats.active}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Bu Ay Yeni</p><p className="text-2xl font-bold text-info">{stats.newThisMonth}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Ort. Harcama</p><p className="text-2xl font-bold text-gold-primary">{formatCurrency(stats.avgSpent)}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Toplam Gelir</p><p className="text-2xl font-bold text-text-primary">{formatCurrency(stats.totalRevenue)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input placeholder="İsim, e-posta, telefon ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter} className="w-[160px]">
              <SelectTrigger><SelectValue placeholder="Seviye" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tüm Seviyeler</SelectItem>
                {TIERS.map(t => <SelectItem key={t.name} value={t.name}>{t.icon} {t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter} className="w-[140px]">
              <SelectTrigger><SelectValue placeholder="Durum" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tümü</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Pasif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="table-container">
            <table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border-subtle bg-bg-tertiary/50">
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Müşteri</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">İletişim</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Sadakat</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Ziyaretler</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Harcama</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Son Ziyaret</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Favori Berber</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Durum</TableHead>
                  <TableHead className="w-12 px-4 py-3">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map(customer => (
                  <TableRow key={customer.id} className="border-b border-border-subtle/50 hover:bg-bg-tertiary/30 cursor-pointer"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-lg">{customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-text-primary">{customer.name}</p>
                          <p className="text-sm text-text-muted">{customer.birthDate ? `${formatDate(customer.birthDate, 'd MMM yyyy')} (${new Date().getFullYear() - new Date(customer.birthDate).getFullYear()} ys)` : ''}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="space-y-1 text-sm">
                        {customer.email && <div className="flex items-center gap-1 text-text-muted"><Mail className="h-3.5 w-3.5" />{customer.email}</div>}
                        <div className="flex items-center gap-1 text-text-muted"><Phone className="h-3.5 w-3.5" />{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge style={{ backgroundColor: `${getTierColor(customer.tier)}20`, borderColor: `${getTierColor(customer.tier)}60`, color: getTierColor(customer.tier) }} className="flex items-center gap-1">
                          {TIERS.find(t => t.name === customer.tier)?.icon} {customer.tier}
                        </Badge>
                        <span className="text-sm text-text-secondary">{customer.loyaltyPoints} puan</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-text-secondary">{customer.totalVisits}</TableCell>
                    <TableCell className="px-4 py-3 font-semibold text-gold-primary">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell className="px-4 py-3 text-text-secondary">{customer.lastVisit ? formatRelativeTime(customer.lastVisit) : 'Henüz yok'}</TableCell>
                    <TableCell className="px-4 py-3 text-text-secondary">{customer.favoriteBarber || '-'}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={customer.active ? 'success' : 'outline'}>
                        {customer.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={open => !open && setSelectedCustomer(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-2 gap-6 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16"><AvatarFallback className="text-2xl">{selectedCustomer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <Badge style={{ backgroundColor: `${getTierColor(selectedCustomer.tier)}20`, color: getTierColor(selectedCustomer.tier), borderColor: `${getTierColor(selectedCustomer.tier)}60` }} className="flex items-center gap-1">
                      {TIERS.find(t => t.name === selectedCustomer.tier)?.icon} {selectedCustomer.tier}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-bg-tertiary rounded-lg">
                  <p className="text-text-muted text-sm">Sadakat Puanı</p>
                  <p className="text-3xl font-bold text-gold-primary">{selectedCustomer.loyaltyPoints}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-tertiary rounded-lg"><p className="text-text-muted text-sm">Toplam Ziyaret</p><p className="text-2xl font-bold">{selectedCustomer.totalVisits}</p></div>
                  <div className="p-4 bg-bg-tertiary rounded-lg"><p className="text-text-muted text-sm">Toplam Harcama</p><p className="text-2xl font-bold text-gold-primary">{formatCurrency(selectedCustomer.totalSpent)}</p></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-bg-tertiary rounded-lg">
                  <h4 className="font-medium mb-3">İletişim</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">E-posta</span><span>{selectedCustomer.email || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Telefon</span><span>{selectedCustomer.phone}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Doğum</span><span>{selectedCustomer.birthDate ? formatDate(selectedCustomer.birthDate, 'd MMMM yyyy') : '-'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Favori Berber</span><span>{selectedCustomer.favoriteBarber || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Pazarlama İzni</span><Badge variant={selectedCustomer.marketingConsent ? 'success' : 'outline'}>{selectedCustomer.marketingConsent ? 'Var' : 'Yok'}</Badge></div>
                  </div>
                </div>
                <div className="p-4 bg-bg-tertiary rounded-lg">
                  <h4 className="font-medium mb-3">Geçmiş</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Son Ziyaret</span><span>{selectedCustomer.lastVisit ? formatRelativeTime(selectedCustomer.lastVisit) : 'Yok'}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Kayıt Tarihi</span><span>2026-01-15</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Kapat</Button>
            <Button variant="gold"><Edit className="h-4 w-4 mr-2" />Düzenle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}