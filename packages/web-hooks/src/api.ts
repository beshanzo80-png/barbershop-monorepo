import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@barbershop/ui';
import type { 
  Service, 
  Barber, 
  Appointment, 
  Customer, 
  Notification,
  TimeSlot,
  ServiceCategory 
} from '@barbershop/types';

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types for API responses
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== API FUNCTIONS ====================
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// ==================== SERVICES ====================
export function useServices(category?: ServiceCategory) {
  return useQuery({
    queryKey: ['services', category],
    queryFn: () => fetchJson<Service[]>(`/services${category ? `?category=${category}` : ''}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => fetchJson<Service>(`/services/${id}`),
    enabled: !!id,
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: () => fetchJson<string[]>('/services/categories'),
    staleTime: 10 * 60 * 1000,
  });
}

// ==================== BARBERS ====================
export function useBarbers(filters?: { available?: boolean; specialty?: string }) {
  const params = new URLSearchParams();
  if (filters?.available) params.set('available', 'true');
  if (filters?.specialty) params.set('specialty', filters.specialty);
  
  return useQuery({
    queryKey: ['barbers', filters],
    queryFn: () => fetchJson<Barber[]>(`/barbers?${params.toString()}`),
    staleTime: 2 * 60 * 1000,
  });
}

export function useBarber(id: string) {
  return useQuery({
    queryKey: ['barber', id],
    queryFn: () => fetchJson<Barber>(`/barbers/${id}`),
    enabled: !!id,
  });
}

export function useBarberSchedule(barberId: string) {
  return useQuery({
    queryKey: ['barber-schedule', barberId],
    queryFn: () => fetchJson<{ dayOfWeek: number; startTime: string; endTime: string; breakStart?: string; breakEnd?: string }[]>(`/barbers/${barberId}/schedule`),
    enabled: !!barberId,
  });
}

export function useBarberAvailability(barberId: string, date: string, serviceDuration: number) {
  return useQuery({
    queryKey: ['availability', barberId, date, serviceDuration],
    queryFn: () => fetchJson<TimeSlot[]>(`/barbers/${barberId}/availability?date=${date}&duration=${serviceDuration}`),
    enabled: !!barberId && !!date,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// ==================== APPOINTMENTS ====================
export function useAppointments(status?: string) {
  return useQuery({
    queryKey: ['appointments', status],
    queryFn: () => fetchJson<Appointment[]>(`/appointments${status ? `?status=${status}` : ''}`),
    staleTime: 1 * 60 * 1000,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchJson<Appointment>(`/appointments/${id}`),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      serviceIds: string[];
      barberId: string;
      chairId?: string;
      date: string;
      time: string;
      phone: string;
      email: string;
      notes?: string;
      paymentMethod: string;
    }) => fetchJson<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast({ title: 'Randevu oluşturuldu', variant: 'success' });
    },
    onError: (error: Error) => {
      toast({ title: 'Hata', message: error.message, variant: 'error' });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fetchJson<Appointment>(`/appointments/${id}/cancel`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Randevu iptal edildi', variant: 'success' });
    },
    onError: (error: Error) => {
      toast({ title: 'Hata', message: error.message, variant: 'error' });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, date, time }: { id: string; date: string; time: string }) => 
      fetchJson<Appointment>(`/appointments/${id}/reschedule`, {
        method: 'PUT',
        body: JSON.stringify({ date, time }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Randevu yeniden planlandı', variant: 'success' });
    },
    onError: (error: Error) => {
      toast({ title: 'Hata', message: error.message, variant: 'error' });
    },
  });
}

// ==================== PROFILE ====================
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchJson<Customer>('/auth/me'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; phone?: string; birthDate?: string; preferredBarberId?: string }) =>
      fetchJson<Customer>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Profil güncellendi', variant: 'success' });
    },
    onError: (error: Error) => {
      toast({ title: 'Hata', message: error.message, variant: 'error' });
    },
  });
}

// ==================== NOTIFICATIONS ====================
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchJson<Notification[]>('/notifications'),
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => fetchJson<void>(`/notifications/${id}/read`, { method: 'PUT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ==================== LOYALTY ====================
export function useLoyalty() {
  return useQuery({
    queryKey: ['loyalty'],
    queryFn: () => fetchJson<{ points: number; tier: string; transactions: any[] }>('/loyalty/me'),
    staleTime: 2 * 60 * 1000,
  });
}

// ==================== SETTINGS ====================
export function useSettings(category?: string) {
  return useQuery({
    queryKey: ['settings', category],
    queryFn: () => fetchJson<Record<string, any>>(`/settings${category ? `?category=${category}` : ''}`),
    staleTime: 10 * 60 * 1000,
  });
}

// ==================== PAYMENTS ====================
export function useInitializePayment() {
  return useMutation({
    mutationFn: (data: { appointmentId: string; amount: number; method: string; returnUrl: string }) =>
      fetchJson<{ paymentUrl: string; paymentId: string }>('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}