'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Badge
} from '@barbershop/ui';
import {
  Calendar, DollarSign, Users, TrendingUp, TrendingDown,
  BarChart3, PieChart, Activity, Target, Download
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell, AreaChart, Area
} from 'recharts';
import { formatCurrency, formatDate } from '@barbershop/utils';
import { cn } from '@barbershop/utils';

const MONTHLY_DATA = [
  { month: 'Oca', revenue: 450000, appointments: 320, newCustomers: 45, avgTicket: 1406 },
  { month: 'Şub', revenue: 480000, appointments: 340, newCustomers: 52, avgTicket: 1412 },
  { month: 'Mar', revenue: 520000, appointments: 380, newCustomers: 61, avgTicket: 1368 },
  { month: 'Nis', revenue: 490000, appointments: 350, newCustomers: 48, avgTicket: 1400 },
  { month: 'May', revenue: 550000, appointments: 390, newCustomers: 55, avgTicket: 1410 },
  { month: 'Haz', revenue: 580000, appointments: 410, newCustomers: 62, avgTicket: 1415 },
  { month: 'Tem', revenue: 620000, appointments: 430, newCustomers: 68, avgTicket: 1442 },
  { month: 'Ağu', revenue: 590000, appointments: 400, newCustomers: 58, avgTicket: 1475 },
  { month: 'Eyl', revenue: 560000, appointments: 380, newCustomers: 52, avgTicket: 1474 },
  { month: 'Eki', revenue: 0, appointments: 0, newCustomers: 0, avgTicket: 0 },
  { month: 'Kas', revenue: 0, appointments: 0, newCustomers: 0, avgTicket: 0 },
  { month: 'Ara', revenue: 0, appointments: 0, newCustomers: 0, avgTicket: 0 },
];

const SERVICE_REVENUE = [
  { service: 'Saç Kesimi', revenue: 2450000, count: 1633, percentage: 38 },
  { service: 'Sakal Tıraşı', revenue: 980000, count: 12250, percentage: 15 },
  { service: 'Paketler', revenue: 1450000, count: 7250, percentage: 22 },
  { service: 'Boya', revenue: 980000, count: 5444, percentage: 15 },
  { service: 'Bakım', revenue: 650000, count: 5416, percentage: 10 },
];

const BARBER_REVENUE = [
  { name: 'Ahmet Usta', revenue: 2800000, appointments: 1800, rating: 4.9 },
  { name: 'Mehmet Usta', revenue: 1950000, appointments: 1450, rating: 4.8 },
  { name: 'Can Usta', revenue: 1320000, appointments: 980, rating: 4.7 },
];

const RETENTION_DATA = [
  { period: '1. Ay', rate: 65 },
  { period: '2. Ay', rate: 52 },
  { period: '3. Ay', rate: 43 },
  { period: '6. Ay', rate: 28 },
  { period: '12. Ay', rate: 15 },
];

const KPI_CARDS = [
  { label: 'Toplam Gelir (YTD)', value: '7,240,000 ₺', change: '+23%', trend: 'up', icon: DollarSign },
  { label: 'Toplam Randevu', value: '4,250', change: '+18%', trend: 'up', icon: Calendar },
  { label: 'Aktif Müşteri', value: '1,234', change: '+12%', trend: 'up', icon: Users },
  { label: 'Ort. Sepet', value: '1,704 ₺', change: '+5%', trend: 'up', icon: BarChart3 },
  { label: 'Müşteri Tutundurma', value: '43%', change: '+3%', trend: 'up', icon: Target },
  { label: 'NPS Skoru', value: '72', change: '+4', trend: 'up', icon: Activity },
];

const COLORS = ['#D4A843', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

function KPICard({ card }: { card: typeof KPI_CARDS[0] }) {
  const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = card.trend === 'up' ? 'text-success' : 'text-error';
  const Icon = card.icon;

  return (
    <Card className="stat-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-secondary text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendIcon className={cn('h-4 w-4', trendColor)} />
              <span className={cn('text-sm font-medium', trendColor)}>{card.change}</span>
              <span className="text-text-muted text-sm">yıl bazında</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gold-subtle">
            <Icon className="h-6 w-6 text-gold-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Aylık Gelir Trendi</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={MONTHLY_DATA.filter(d => d.revenue > 0)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
            <XAxis dataKey="month" stroke="#808080" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#808080" fontSize={12} tickLine={false} axisLine={false} 
              tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [formatCurrency(value), 'Gelir']}
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
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hizmet Bazlı Gelir Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={SERVICE_REVENUE}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="revenue"
              nameKey="service"
              label={({ service, percent }) => `${service} ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {SERVICE_REVENUE.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [formatCurrency(value), 'Gelir']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function BarberComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Berber Performans Karşılaştırması</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={BARBER_REVENUE} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" horizontal={false} />
            <XAxis type="number" stroke="#808080" fontSize={12} tickLine={false} axisLine={false} 
              tickFormatter={(value) => `${(value/1000000).toFixed(1)}M`} />
            <YAxis dataKey="name" type="category" stroke="#808080" fontSize={12} tickLine={false} axisLine={false} width={100} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [formatCurrency(value), 'Gelir']}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#D4A843" radius={[0, 4, 4, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function RetentionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Müşteri Tutundurma (Cohort)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={RETENTION_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
            <XAxis dataKey="period" stroke="#808080" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#808080" fontSize={12} tickLine={false} axisLine={false} 
              tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 168, 67, 0.3)', borderRadius: '12px' }}
              formatter={(value: number) => [`%${value}`, 'Tutundurma']}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#D4A843"
              strokeWidth={3}
              dot={{ fill: '#D4A843', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function WeeklyHeatmap() {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 9}:00`);
  const data = hours.map((hour, h) => ({
    hour,
    ...days.reduce((acc, day, d) => {
      acc[day] = Math.floor(Math.random() * 100);
      return acc;
    }, {} as Record<string, number>)
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haftalık Yoğunluk Haritası</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted">
                <th className="px-3 py-2 text-left">Saat</th>
                {days.map(day => <th key={day} className="px-3 py-2 text-center">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, h) => (
                <tr key={row.hour}>
                  <td className="px-3 py-2 text-text-muted font-medium">{row.hour}</td>
                  {days.map((day, d) => (
                    <td key={day} className="px-3 py-2 text-center">
                      <div className={cn(
                        'w-8 h-8 mx-auto rounded transition-colors',
                        row[day] > 70 ? 'bg-gold-primary text-text-on-gold' :
                        row[day] > 40 ? 'bg-gold-primary/50 text-gold-primary' :
                        row[day] > 20 ? 'bg-gold-subtle text-gold-dark' :
                        'bg-bg-tertiary text-text-muted'
                      )}>
                        {row[day] > 0 ? row[day] : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analitik ve Raporlar</h1>
          <p className="text-text-secondary">İş performansınızı takip edin ve veri odaklı kararlar alın</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange} className="w-[180px]">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Son 7 Gün</SelectItem>
              <SelectItem value="month">Son 30 Gün</SelectItem>
              <SelectItem value="quarter">Son 3 Ay</SelectItem>
              <SelectItem value="year">Bu Yıl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Rapor İndir</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map(card => <KPICard key={card.label} card={card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ServiceDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarberComparisonChart />
        <RetentionChart />
      </div>

      <WeeklyHeatmap />
    </div>
  );
}