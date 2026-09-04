'use client';

import * as React from 'react';
import { Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent, Badge, Button } from '@barbershop/ui';
import { useAppointmentsStore } from '@barbershop/web-hooks';
import { Calendar, Clock, MapPin, X, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { formatDate, formatTime, formatCurrency, appointmentStatusLabels, appointmentStatusColors } from '@barbershop/utils';
import type { AppointmentStatus } from '@barbershop/types';

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    barber: { user: { name: 'Ahmet Usta', avatar: null } },
    services: [{ service: { name: 'Saç Kesimi' }, duration: 30, price: 150 }],
    status: 'CONFIRMED' as AppointmentStatus,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    finalPrice: 150,
    chair: { number: 2 },
  },
  {
    id: '2',
    barber: { user: { name: 'Mehmet Usta', avatar: null } },
    services: [{ service: { name: 'Sakal Tıraşı' }, duration: 20, price: 80 }],
    status: 'COMPLETED' as AppointmentStatus,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
    finalPrice: 80,
    chair: { number: 3 },
  },
];

function AppointmentCard({ appointment }: { appointment: typeof MOCK_APPOINTMENTS[0] }) {
  const statusLabel = appointmentStatusLabels[appointment.status] || appointment.status;
  const statusColor = appointmentStatusColors[appointment.status] as 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  
  const statusIcons: Record<AppointmentStatus, React.ReactNode> = {
    PENDING: <Loader2 className="h-4 w-4 animate-spin" />,
    CONFIRMED: <CheckCircle className="h-4 w-4" />,
    IN_PROGRESS: <Loader2 className="h-4 w-4 animate-spin" />,
    COMPLETED: <CheckCircle className="h-4 w-4" />,
    CANCELLED: <X className="h-4 w-4" />,
    NO_SHOW: <X className="h-4 w-4" />,
    RESCHEDULED: <Clock className="h-4 w-4" />,
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg bg-${statusColor}/10`}>
            {statusIcons[appointment.status]}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-text-primary">
                  {appointment.barber.user.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {appointment.services.map(s => s.service.name).join(', ')}
                </p>
              </div>
              <Badge variant={statusColor}>{statusLabel}</Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(appointment.startTime, 'EEEE, d MMMM', { locale: 'tr' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Koltuk {appointment.chair?.number}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xl font-bold text-gold-primary">{formatCurrency(appointment.finalPrice)}</p>
            </div>
            {['PENDING', 'CONFIRMED'].includes(appointment.status) && (
              <Button variant="outline" size="sm" icon={<X className="h-3.5 w-3.5" />}>
                İptal Et
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AppointmentsPage() {
  const { upcoming, past, isLoading } = useAppointmentsStore();

  // Use mock data for demo
  const upcomingAppointments = MOCK_APPOINTMENTS.filter(a => ['PENDING', 'CONFIRMED'].includes(a.status));
  const pastAppointments = MOCK_APPOINTMENTS.filter(a => ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(a.status));

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Randevularım</h1>
          <p className="text-text-secondary">Aktif ve geçmiş randevularınızı yönetin</p>
        </div>
        <Button asChild>
          <a href="/booking">
            <span>Yeni Randevu</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="bg-bg-tertiary">
          <TabsTrigger value="upcoming" className="px-6 py-3">
            Aktif Randevular ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="px-6 py-3">
            Geçmiş Randevular ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 animate-in fade-in-0">
          {isLoading && <p>Randevular yükleniyor...</p>}
          {!isLoading && upcomingAppointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-1">Aktif randevunuz yok</h3>
                <p className="text-text-secondary mb-4">Yeni bir randevu almak için aşağıdaki butonu kullanın</p>
                <Button asChild>
                  <a href="/booking">Randevu Al</a>
                </Button>
              </CardContent>
            </Card>
          )}
          {!isLoading && upcomingAppointments.map(appt => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 animate-in fade-in-0">
          {pastAppointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-16 w-16 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-1">Henüz geçmiş randevunuz yok</h3>
                <p className="text-text-secondary">Randevunuz tamamlandığında burada görünecek</p>
              </CardContent>
            </Card>
          )}
          {pastAppointments.map(appt => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}