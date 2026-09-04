import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, isValid, addMinutes, addHours, addDays, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { z } from 'zod';

/**
 * Utility function to merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, pattern: string = 'd MMMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, pattern, { locale: tr });
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string, pattern: string = 'HH:mm'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, pattern, { locale: tr });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return format(d, 'd MMMM yyyy, HH:mm', { locale: tr });
}

/**
 * Relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '-';
  return formatDistanceToNow(d, { addSuffix: true, locale: tr });
}

/**
 * Format currency (TRY)
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0,00 ₺';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format duration in minutes to human readable
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} sa ${mins} dk` : `${hours} sa`;
}

/**
 * Generate time slots for a day
 */
export function generateTimeSlots(
  startTime: string, // "09:00"
  endTime: string,   // "19:00"
  intervalMinutes: number = 30,
  breakStart?: string,
  breakEnd?: string
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  const breakStartMin = breakStart ? breakStart.split(':').map(Number).reduce((h, m) => h * 60 + m) : -1;
  const breakEndMin = breakEnd ? breakEnd.split(':').map(Number).reduce((h, m) => h * 60 + m) : -1;
  
  while (currentMinutes + intervalMinutes <= endMinutes) {
    // Skip break time
    if (breakStartMin !== -1 && breakEndMin !== -1) {
      if (currentMinutes >= breakStartMin && currentMinutes < breakEndMin) {
        currentMinutes = breakEndMin;
        continue;
      }
      if (currentMinutes < breakStartMin && currentMinutes + intervalMinutes > breakStartMin) {
        currentMinutes = breakStartMin;
        continue;
      }
    }
    
    const hour = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const min = (currentMinutes % 60).toString().padStart(2, '0');
    slots.push(`${hour}:${min}`);
    currentMinutes += intervalMinutes;
  }
  
  return slots;
}

/**
 * Check if time slot is available
 */
export function isSlotAvailable(
  slotStart: string,
  slotDuration: number,
  bookedSlots: { start: string; end: string }[],
  breakStart?: string,
  breakEnd?: string
): boolean {
  const [slotHour, slotMin] = slotStart.split(':').map(Number);
  const slotStartMin = slotHour * 60 + slotMin;
  const slotEndMin = slotStartMin + slotDuration;
  
  // Check break
  if (breakStart && breakEnd) {
    const [bStartH, bStartM] = breakStart.split(':').map(Number);
    const [bEndH, bEndM] = breakEnd.split(':').map(Number);
    const breakStartMin = bStartH * 60 + bStartM;
    const breakEndMin = bEndH * 60 + bEndM;
    
    if (slotStartMin < breakEndMin && slotEndMin > breakStartMin) {
      return false;
    }
  }
  
  // Check booked slots
  for (const booked of bookedSlots) {
    const [bStartH, bStartM] = booked.start.split(':').map(Number);
    const [bEndH, bEndM] = booked.end.split(':').map(Number);
    const bookedStartMin = bStartH * 60 + bStartM;
    const bookedEndMin = bEndH * 60 + bEndM;
    
    if (slotStartMin < bookedEndMin && slotEndMin > bookedStartMin) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get day name in Turkish
 */
export function getDayName(dayIndex: number): string {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  return days[dayIndex] || '';
}

/**
 * Get short day name in Turkish
 */
export function getShortDayName(dayIndex: number): string {
  const days = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];
  return days[dayIndex] || '';
}

/**
 * Get month name in Turkish
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return months[monthIndex] || '';
}

/**
 * Validate Turkish phone number
 */
export function validatePhoneNumber(phone: string): boolean {
  // E.164 format for Turkey: +905xxxxxxxxx
  const phoneRegex = /^\+905\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // +905551234567 -> +90 555 123 45 67
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('90') && cleaned.length === 12) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  return phone;
}

/**
 * Generate random UUID (for client-side temporary IDs)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by multiple keys
 */
export function sortBy<T>(array: T[], ...keys: (keyof T | { key: keyof T; order: 'asc' | 'desc' })[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const k = typeof key === 'object' ? key.key : key;
      const order = typeof key === 'object' ? key.order : 'asc';
      const aVal = a[k];
      const bVal = b[k];
      
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Zod schemas for common validations
 */
export const phoneSchema = z.string().regex(/^\+905\d{9}$/, 'Geçerli bir Türkiye telefon numarası giriniz (+905xxxxxxxxx)');
export const emailSchema = z.string().email('Geçerli bir e-posta adresi giriniz');
export const passwordSchema = z.string().min(8, 'Şifre en az 8 karakter olmalıdır').regex(/[A-Z]/, 'En az bir büyük harf').regex(/[a-z]/, 'En az bir küçük harf').regex(/[0-9]/, 'En az bir rakam').regex(/[^A-Za-z0-9]/, 'En az bir özel karakter');
export const nameSchema = z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(100, 'İsim en fazla 100 karakter olabilir');
export const notesSchema = z.string().max(500, 'Not en fazla 500 karakter olabilir').optional();

/**
 * Appointment status labels in Turkish
 */
export const appointmentStatusLabels: Record<string, string> = {
  PENDING: 'Onay Bekliyor',
  CONFIRMED: 'Onaylandı',
  IN_PROGRESS: 'Devam Ediyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
  NO_SHOW: 'Gelmedi',
  RESCHEDULED: 'Ertelendi',
};

/**
 * Appointment status colors
 */
export const appointmentStatusColors: Record<string, string> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'gold',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'error',
  RESCHEDULED: 'info',
};

/**
 * Payment status labels
 */
export const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  PAID: 'Ödendi',
  PARTIAL: 'Kısmi Ödendi',
  REFUNDED: 'İade Edildi',
  FAILED: 'Başarısız',
};

/**
 * Service category labels
 */
export const serviceCategoryLabels: Record<string, string> = {
  HAIRCUT: 'Saç Kesimi',
  BEARD: 'Sakal',
  COLORING: 'Boya',
  TREATMENT: 'Bakım',
  PACKAGE: 'Paketler',
  KIDS: 'Çocuk',
};

/**
 * Notification type labels
 */
export const notificationTypeLabels: Record<string, string> = {
  APPOINTMENT_CONFIRMED: 'Randevu Onaylandı',
  APPOINTMENT_REMINDER_24H: '24 Saat Hatırlatma',
  APPOINTMENT_REMINDER_2H: '2 Saat Hatırlatma',
  APPOINTMENT_CANCELLED: 'Randevu İptal',
  APPOINTMENT_RESCHEDULED: 'Randevu Ertelendi',
  BARBER_ASSIGNED: 'Berber Atandı',
  REVIEW_REQUEST: 'Değerlendirme İsteği',
  PROMOTION: 'Kampanya',
  LOYALTY_REWARD: 'Sadakat Ödülü',
  SYSTEM: 'Sistem',
};