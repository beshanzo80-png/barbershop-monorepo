'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent,
  Progress, Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@barbershop/ui';
import {
  Users, Calendar, DollarSign, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, UserPlus, BarChart3,
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@barbershop/utils';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock data
const STATS = [
  { label: 'Bugünkü Randevular', value: '24', change: '+12%', trend: 'up', icon: Calendar, color: 'gold' },
  { label: 'Aktif Müşteriler', value: '1,234', change: '+5%', trend: 'up', icon: Users, color: 'info' },
  { label: 'Bu Ay Gelir', value: '127,500 ₺', change: '+18%', trend: 'up', icon: DollarSign, color: 'success' },
  { label: 'Ortalama Değerlendirme', value: '4.8', change: '+0.2', trend: 'up', icon: BarChart3, color: 'warning' },
];

const RECENT_APPOINTMENTS = [
  { id: '1', customer: 'Ali Yılmaz', barber: 'Ahmet Usta', service: 'Saç + Sakal', time: '14:30', status: 'CONFIRMED', price: 200 },
  { id: '2', customer: 'Veli Demir', barber: 'Mehmet Usta', service: 'Sakal Tıraşı', time: '15:00', status: 'IN_PROGRESS', price: 80 },
  { id: '3', customer: 'Mehmet Kaya', barber: 'Can Usta', service: 'Saç Kesimi', time: '15:30', status: 'PENDING', price: 150 },
  { id: '4', customer: 'Ahmet Öz', barber: 'Ahmet Usta', service: 'Cilt Bakımı', time: '16:00', status: 'COMPLETED', price: 120 },
  { id: '5', customer: 'Can Yıldız', barber: 'Mehmet Usta', service: 'Saç Boyama', time: '10:00', status: 'CANCELLED', price: 180 },
];

const WEEKLY_REVENUE = [
  { day: 'Pzt', revenue: 12500, appointments: 18 },
  { day: 'Sal', revenue: 14200, appointments: 22 },
  { day: 'Çar', revenue: 11800, appointments: 19 },
  { day: 'Per', revenue: 15600, appointments: 24 },
  { day: 'Cum', revenue: 18900, appointments: 28 },
  { day: 'Cmt', revenue: 22100, appointments: 35 },
  { day: 'Paz', revenue: 8400, appointments: 12 },
];

const SERVICE_DISTRIBUTION = [
  { name: 'Saç Kesimi', value: 45, color: '#D4A843' },
  { name: 'Sakal Tıraşı', value: 25, color: '#10B981' },
  { name: 'Paketler', value: 15, color: '#3B82F6' },
  { name: 'Boya', value: 10, color: '#F59E0B' },
  { name: 'Bakım', value: 5, color: '#EF4444' },
];

const BARBER_PERFORMANCE = [
  { name: 'Ahmet Usta', appointments: 42, revenue: 68000, rating: 4.9 },
  { name: 'Mehmet Usta', appointments: 35, revenue: 45000, rating: 4.8 },
  { name: 'Can Usta', appointments: 28, revenue: 32000, rating: 4.7 },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  PENDING: { bg: 'bg-warning-bg', text: 'text-warning', icon: <Clock className="h-3.5 w-3.5" /> },
  CONFIRMED: { bg: 'bg-info-bg', text: 'text-info', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  IN_PROGRESS: { bg: 'bg-gold-subtle', text: 'text-gold-primary', icon: <Clock className="h-3.5 w-3.5 animate-spin" /> },
  COMPLETED: { bg: 'bg-success-bg', text: 'text-success', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  CANCELLED: { bg: 'bg-error-bg', text: 'text-error', icon: <XCircle className="h-3.5 w-3.5" /> },
  NO_SHOW: { bg: 'bg-error-bg', text: 'text-error', icon: <XCircle className="h-3.5 w-3.5" /> },
};

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-error' : 'text-text-muted';

  return (
    <Card className="stat-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon className={cn('h-4 w-4', trendColor)} />
              <span className={cn('text-sm font-medium', trendColor)}>{stat.change}</span>
              <span className="text-text-muted text-sm">önceki ay</span>
            </div>
          </div>
          <div className={cn('p-3 rounded-xl', `bg-${stat.color}-subtle`)}>
            <Icon className={cn('h-6 w-6', `text-${stat.color}-primary`)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Haftalık Gelir</CardTitle>
        <Select defaultValue="week" className="w-[150px]">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Bu Hafta</SelectItem>
            <SelectItem value="month">Bu Ay</SelectItem>
            <SelectItem value="year">Bu Yıl</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={WEEKLY_REVENUE} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
            <XAxis dataKey="day" stroke="#808080" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#808080" fontSize={12} tickLine={false} axisLine={false} 
              tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [formatCurrency(value), 'Gelir']}
              labelFormatter={(label) => `Gün: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#D4A843"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ServiceDistributionChart() {
  const COLORS = SERVICE_DISTRIBUTION.map(d => d.color);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hizmet Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={SERVICE_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {SERVICE_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [`%${value}`, 'Pay']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function AppointmentsTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Son Randevular</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <a href="/appointments">Tümünü Gör →</a>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left text-sm text-text-muted">
                <th className="px-4 py-3 font-medium">Müşteri</th>
                <th className="px-4 py-3 font-medium">Berber</th>
                <th className="px-4 py-3 font-medium">Hizmet</th>
                <th className="px-4 py-3 font-medium">Saat</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium text-right">Tutar</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_APPOINTMENTS.map((appt) => {
                const status = STATUS_COLORS[appt.status];
                return (
                  <tr key={appt.id} className="border-b border-border-subtle/50 hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{appt.customer}</div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{appt.barber}</td>
                    <td className="px-4 py-3 text-text-secondary">{appt.service}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-text-muted">
                        <Clock className="h-3.5 w-3.5" />
                        {appt.time}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.text)}>
                        {status.icon}
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gold-primary">{formatCurrency(appt.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function BarberPerformanceTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Berber Performansı (Bu Ay)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left text-sm text-text-muted">
                <th className="px-4 py-3 font-medium">Berber</th>
                <th className="px-4 py-3 font-medium text-center">Randevular</th>
                <th className="px-4 py-3 font-medium text-center">Gelir</th>
                <th className="px-4 py-3 font-medium text-center">Değerlendirme</th>
                <th className="px-4 py-3 font-medium text-center">Ort. Randevu Değeri</th>
              </tr>
            </thead>
            <tbody>
              {BARBER_PERFORMANCE.map((barber, i) => (
                <tr key={barber.name} className="border-b border-border-subtle/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{barber.name}</td>
                  <td className="px-4 py-3 text-center text-text-secondary">{barber.appointments}</td>
                  <td className="px-4 py-3 text-center font-semibold text-gold-primary">{formatCurrency(barber.revenue)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold">{barber.rating}</span>
                      <svg className="h-4 w-4 fill-warning text-warning" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-text-secondary">
                    {formatCurrency(Math.round(barber.revenue / barber.appointments))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'year'>('week');

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary">Genel performans ve istatistikler</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange} className="w-[180px]">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Son 7 Gün</SelectItem>
              <SelectItem value="month">Son 30 Gün</SelectItem>
              <SelectItem value="year">Bu Yıl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ServiceDistributionChart />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsTable />
        <BarberPerformanceTable />
      </div>
    </div>
  );
}