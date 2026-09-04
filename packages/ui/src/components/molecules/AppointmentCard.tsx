'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from '../atoms';
import { Badge } from '../atoms';
import { Button } from '../atoms';
import { Avatar, AvatarImage, AvatarFallback } from '../atoms';
import { cn } from '../../lib/utils';
import { formatDate, formatTime, formatCurrency, appointmentStatusLabels, appointmentStatusColors } from '@barbershop/utils';
import { Calendar, Clock, MapPin, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '@barbershop/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (appointmentId: string) => void;
  onReschedule?: (appointmentId: string) => void;
  onViewDetails?: (appointmentId: string) => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
}

const statusIcons: Record<AppointmentStatus, React.ReactNode> = {
  PENDING: <Loader2 className="h-4 w-4 animate-spin" />,
  CONFIRMED: <CheckCircle className="h-4 w-4" />,
  IN_PROGRESS: <Loader2 className="h-4 w-4 animate-spin" />,
  COMPLETED: <CheckCircle className="h-4 w-4" />,
  CANCELLED: <X className="h-4 w-4" />,
  NO_SHOW: <AlertCircle className="h-4 w-4" />,
  RESCHEDULED: <Clock className="h-4 w-4" />,
};

export function AppointmentCard({ 
  appointment, 
  onCancel, 
  onReschedule, 
  onViewDetails,
  variant = 'default',
  showActions = true 
}: AppointmentCardProps) {
  const statusLabel = appointmentStatusLabels[appointment.status] || appointment.status;
  const statusColor = appointmentStatusColors[appointment.status] as 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  const StatusIcon = statusIcons[appointment.status];
  
  const canCancel = ['PENDING', 'CONFIRMED'].includes(appointment.status);
  const canReschedule = ['PENDING', 'CONFIRMED'].includes(appointment.status);

  if (variant === 'compact') {
    return (
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', `bg-${statusColor}-bg`)}>
            <StatusIcon className={cn(`text-${statusColor}`)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-text-primary truncate">
                {appointment.barber?.user.name || 'Berber'}
              </p>
              <Badge variant={statusColor}>{statusLabel}</Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(appointment.startTime, 'd MMM')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(appointment.startTime)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-gold-primary">{formatCurrency(appointment.finalPrice)}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-lg flex-shrink-0', `bg-${statusColor}-bg`)}>
            <StatusIcon className={cn(`text-${statusColor}`)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">
                    {appointment.barber?.user.name || 'Berber'}
                  </h3>
                  <Badge variant={statusColor}>{statusLabel}</Badge>
                </div>
                {appointment.services && appointment.services.length > 0 && (
                  <p className="mt-1 text-sm text-text-secondary flex flex-wrap gap-1">
                    {appointment.services.map((as, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {as.service?.name || 'Hizmet'}
                        {i < appointment.services.length - 1 && <span className="text-text-muted">+</span>}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(appointment.startTime, 'EEEE, d MMMM yyyy', { locale: 'tr' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Koltuk {appointment.chair?.number || '-'}
              </span>
            </div>

            {appointment.notes && (
              <p className="mt-2 text-sm text-text-secondary bg-bg-tertiary p-2 rounded-md">
                {appointment.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-2xl font-bold text-gold-primary">{formatCurrency(appointment.finalPrice)}</p>
              {appointment.discount > 0 && (
                <p className="text-xs text-success line-through">
                  {formatCurrency(appointment.totalPrice)}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex-wrap">
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(appointment.id)}
              icon={<X className="h-3.5 w-3.5" />}
            >
              İptal Et
            </Button>
          )}
          {canReschedule && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onReschedule?.(appointment.id)}
              icon={<Clock className="h-3.5 w-3.5" />}
            >
              Yeniden Planla
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(appointment.id)}
          >
            Detaylar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}