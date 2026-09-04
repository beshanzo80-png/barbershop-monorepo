'use client';

import * as React from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
  Badge, Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@barbershop/ui';
import {
  Search, Filter, Calendar, MoreVertical, Edit, Trash2,
  CheckCircle, XCircle, Clock, Eye, Download
} from 'lucide-react';
import { formatDate, formatTime, formatCurrency, appointmentStatusLabels, appointmentStatusColors } from '@barbershop/utils';
import { cn } from '@barbershop/utils';

// Extended mock data
const MOCK_APPOINTMENTS = [
  { id: '1', customer: 'Ali Yılmaz', customerPhone: '+905554444444', barber: 'Ahmet Usta', service: 'Saç + Sakal', date: '2026-09-15T14:30:00', duration: 45, status: 'CONFIRMED', price: 200, notes: 'Sakal şekli korunsun' },
  { id: '2', customer: 'Veli Demir', customerPhone: '+905555555555', barber: 'Mehmet Usta', service: 'Sakal Tıraşı', date: '2026-09-15T15:00:00', duration: 20, status: 'IN_PROGRESS', price: 80, notes: '' },
  { id: '3', customer: 'Mehmet Kaya', customerPhone: '+905556666666', barber: 'Can Usta', service: 'Saç Kesimi', date: '2026-09-15T15:30:00', duration: 30, status: 'PENDING', price: 150, notes: 'Kısa yap, yanları sıfırla' },
  { id: '4', customer: 'Ahmet Öz', customerPhone: '+905557777777', barber: 'Ahmet Usta', service: 'Cilt Bakımı', date: '2026-09-14T16:00:00', duration: 25, status: 'COMPLETED', price: 120, notes: '' },
  { id: '5', customer: 'Can Yıldız', customerPhone: '+905558888888', barber: 'Mehmet Usta', service: 'Saç Boyama', date: '2026-09-14T10:00:00', duration: 45, status: 'CANCELLED', price: 180, notes: 'Müşteri iptal etti' },
  { id: '6', customer: 'Burak Şahin', customerPhone: '+905559999999', barber: 'Can Usta', service: 'Çocuk Kesimi', date: '2026-09-13T11:00:00', duration: 20, status: 'NO_SHOW', price: 100, notes: '' },
  { id: '7', customer: 'Emre Kaya', customerPhone: '+905551111222', barber: 'Ahmet Usta', service: 'Saç Kesimi', date: '2026-09-16T09:30:00', duration: 30, status: 'CONFIRMED', price: 150, notes: '' },
  { id: '8', customer: 'Okan Demir', customerPhone: '+905552222333', barber: 'Mehmet Usta', service: 'Sakal Tıraşı', date: '2026-09-16T10:00:00', duration: 20, status: 'CONFIRMED', price: 80, notes: '' },
  { id: '9', customer: 'Serkan Öz', customerPhone: '+905553333444', barber: 'Can Usta', service: 'Saç + Sakal', date: '2026-09-16T10:30:00', duration: 45, status: 'CONFIRMED', price: 200, notes: '' },
  { id: '10', customer: 'Tolga Yıldız', customerPhone: '+905554444555', barber: 'Ahmet Usta', service: 'Cilt Bakımı', date: '2026-09-16T11:00:00', duration: 25, status: 'CONFIRMED', price: 120, notes: '' },
];

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tümü' },
  { value: 'PENDING', label: 'Bekliyor' },
  { value: 'CONFIRMED', label: 'Onaylandı' },
  { value: 'IN_PROGRESS', label: 'Devam Ediyor' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal' },
  { value: 'NO_SHOW', label: 'Gelmedi' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-warning-bg', text: 'text-warning' },
  CONFIRMED: { bg: 'bg-info-bg', text: 'text-info' },
  IN_PROGRESS: { bg: 'bg-gold-subtle', text: 'text-gold-primary' },
  COMPLETED: { bg: 'bg-success-bg', text: 'text-success' },
  CANCELLED: { bg: 'bg-error-bg', text: 'text-error' },
  NO_SHOW: { bg: 'bg-error-bg', text: 'text-error' },
};

function StatusBadge({ status }: { status: string }) {
  const label = appointmentStatusLabels[status] || status;
  const colors = STATUS_COLORS[status] || { bg: 'bg-bg-tertiary', text: 'text-text-secondary' };
  return (
    <Badge variant="outline" className={cn(colors.bg, colors.text, 'border-transparent')}>
      {label}
    </Badge>
  );
}

function ActionMenu({ appointment }: { appointment: typeof MOCK_APPOINTMENTS[0] }) {
  const [open, setOpen] = React.useState(false);

  const handleAction = (action: string) => {
    setOpen(false);
    switch (action) {
      case 'view':
        alert(`Randevu detayı: ${appointment.id}`);
        break;
      case 'edit':
        alert(`Düzenle: ${appointment.id}`);
        break;
      case 'confirm':
        alert(`Onayla: ${appointment.id}`);
        break;
      case 'complete':
        alert(`Tamamla: ${appointment.id}`);
        break;
      case 'cancel':
        if (confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) {
          alert(`İptal edildi: ${appointment.id}`);
        }
        break;
      case 'delete':
        if (confirm('Kalıcı olarak silmek istediğinizden emin misiniz?')) {
          alert(`Silindi: ${appointment.id}`);
        }
        break;
    }
  };

  const availableActions = [
    { label: 'Görüntüle', action: 'view', icon: Eye },
    { label: 'Düzenle', action: 'edit', icon: Edit },
    ...(appointment.status === 'PENDING' ? [{ label: 'Onayla', action: 'confirm', icon: CheckCircle }] : []),
    ...(appointment.status === 'CONFIRMED' ? [{ label: 'Tamamla', action: 'complete', icon: CheckCircle }] : []),
    ...(['PENDING', 'CONFIRMED'].includes(appointment.status) ? [{ label: 'İptal Et', action: 'cancel', icon: XCircle }] : []),
    { label: 'Sil', action: 'delete', icon: Trash2, destructive: true },
  ];

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open && (
        <div className="fixed z-50 w-48 bg-bg-elevated border border-border-subtle rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
          {availableActions.map((item) => (
            <button
              key={item.action}
              onClick={() => handleAction(item.action)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors',
                'hover:bg-bg-tertiary',
                item.destructive && 'text-error'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [dateFilter, setDateFilter] = React.useState('');
  const [barberFilter, setBarberFilter] = React.useState('ALL');
  const [selectedAppointments, setSelectedAppointments] = React.useState<string[]>([]);
  const [viewDetail, setViewDetail] = React.useState<typeof MOCK_APPOINTMENTS[0] | null>(null);

  const filteredAppointments = MOCK_APPOINTMENTS.filter(appt => {
    const matchesSearch = appt.customer.toLowerCase().includes(search.toLowerCase()) ||
      appt.barber.toLowerCase().includes(search.toLowerCase()) ||
      appt.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;
    const matchesDate = !dateFilter || appt.date.startsWith(dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(filteredAppointments.map(a => a.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedAppointments(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter(a => a.status === 'CONFIRMED').length,
    completed: filteredAppointments.filter(a => a.status === 'COMPLETED').length,
    pending: filteredAppointments.filter(a => a.status === 'PENDING').length,
    revenue: filteredAppointments.filter(a => a.status !== 'CANCELLED' && a.status !== 'NO_SHOW')
      .reduce((sum, a) => sum + a.price, 0),
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Randevu Yönetimi</h1>
          <p className="text-text-secondary">Tüm randevuları görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/appointments/export"><Download className="h-4 w-4 mr-2" />Dışa Aktar</a>
          </Button>
          <Button variant="gold" asChild>
            <a href="/appointments/new">Yeni Randevu</a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Toplam</p><p className="text-2xl font-bold text-text-primary">{stats.total}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Onaylı</p><p className="text-2xl font-bold text-info">{stats.confirmed}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Bekliyor</p><p className="text-2xl font-bold text-warning">{stats.pending}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Tamamlandı</p><p className="text-2xl font-bold text-success">{stats.completed}</p></CardContent></Card>
        <Card className="stat-card"><CardContent className="p-4"><p className="text-text-secondary text-sm">Gelir</p><p className="text-2xl font-bold text-gold-primary">{formatCurrency(stats.revenue)}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                placeholder="Müşteri, berber, hizmet ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter} className="w-[160px]">
              <SelectTrigger><SelectValue placeholder="Durum" /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={barberFilter} onValueChange={setBarberFilter} className="w-[160px]">
              <SelectTrigger><SelectValue placeholder="Berber" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tüm Berberler</SelectItem>
                <SelectItem value="ahmet">Ahmet Usta</SelectItem>
                <SelectItem value="mehmet">Mehmet Usta</SelectItem>
                <SelectItem value="can">Can Usta</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
            />
            {selectedAppointments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gold-primary">
                <CheckCircle className="h-4 w-4" />
                <span>{selectedAppointments.length} seçili</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="table-container">
            <table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-border-subtle bg-bg-tertiary/50">
                  <TableHead className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                    />
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Müşteri</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Berber</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Hizmet</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Tarih / Saat</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Süre</TableHead>
                  <TableHead className="px-4 py-3 text-left text-sm font-medium text-text-muted">Durum</TableHead>
                  <TableHead className="px-4 py-3 text-right text-sm font-medium text-text-muted">Tutar</TableHead>
                  <TableHead className="w-12 px-4 py-3 text-center">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="px-4 py-12 text-center text-text-muted">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Kriterlere uygun randevu bulunamadı</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((appt) => (
                    <TableRow key={appt.id} className="border-b border-border-subtle/50 hover:bg-bg-tertiary/30">
                      <TableCell className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.includes(appt.id)}
                          onChange={(e) => handleSelectOne(appt.id, e.target.checked)}
                          className="w-4 h-4 rounded border-border-default text-gold-primary focus:ring-gold-primary"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="font-medium text-text-primary">{appt.customer}</div>
                        <div className="text-sm text-text-muted">{appt.customerPhone}</div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-text-secondary">{appt.barber}</TableCell>
                      <TableCell className="px-4 py-3 text-text-secondary">{appt.service}</TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-1 text-text-muted">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(appt.date, 'd MMM yyyy')}
                        </div>
                        <div className="flex items-center gap-1 text-text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(appt.date)}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-text-secondary">{appt.duration} dk</TableCell>
                      <TableCell className="px-4 py-3"><StatusBadge status={appt.status} /></TableCell>
                      <TableCell className="px-4 py-3 text-right font-semibold text-gold-primary">{formatCurrency(appt.price)}</TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <ActionMenu appointment={appt} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewDetail} onOpenChange={(open) => !open && setViewDetail(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Randevu Detayı</DialogTitle>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-text-muted text-sm">Müşteri</p><p className="font-medium">{viewDetail.customer}</p></div>
                <div><p className="text-text-muted text-sm">Telefon</p><p className="font-medium">{viewDetail.customerPhone}</p></div>
                <div><p className="text-text-muted text-sm">Berber</p><p className="font-medium">{viewDetail.barber}</p></div>
                <div><p className="text-text-muted text-sm">Hizmet</p><p className="font-medium">{viewDetail.service}</p></div>
                <div><p className="text-text-muted text-sm">Tarih</p><p className="font-medium">{formatDate(viewDetail.date, 'EEEE, d MMMM yyyy')}</p></div>
                <div><p className="text-text-muted text-sm">Saat</p><p className="font-medium">{formatTime(viewDetail.date)} ({viewDetail.duration} dk)</p></div>
                <div><p className="text-text-muted text-sm">Durum</p><p className="font-medium"><StatusBadge status={viewDetail.status} /></p></div>
                <div><p className="text-text-muted text-sm">Tutar</p><p className="font-medium text-gold-primary">{formatCurrency(viewDetail.price)}</p></div>
              </div>
              {viewDetail.notes && (
                <div className="p-4 bg-bg-tertiary rounded-lg">
                  <p className="text-text-muted text-sm">Notlar</p>
                  <p className="text-text-primary">{viewDetail.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetail(null)}>Kapat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}