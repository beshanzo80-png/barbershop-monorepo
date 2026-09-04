// Shared TypeScript types for the Barbershop monorepo

// ==================== USER & AUTH ====================
export type Role = 'CUSTOMER' | 'BARBER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string | null;
  phone: string;
  name: string;
  avatar: string | null;
  role: Role;
  emailVerified: Date | null;
  phoneVerified: Date | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  role: 'CUSTOMER';
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: number;
  birthDate: Date | null;
  notes: string | null;
  preferredBarberId: string | null;
  marketingConsent: boolean;
}

export interface Barber extends User {
  role: 'BARBER';
  bio: string | null;
  experienceYears: number;
  specialties: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  hireDate: Date;
  commissionRate: number;
}

export interface AdminUser extends User {
  role: 'ADMIN' | 'SUPER_ADMIN';
}

// ==================== SERVICES ====================
export type ServiceCategory = 'HAIRCUT' | 'BEARD' | 'COLORING' | 'TREATMENT' | 'PACKAGE' | 'KIDS';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number; // minutes
  price: number;
  category: ServiceCategory;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarberService {
  id: string;
  barberId: string;
  serviceId: string;
  price: number | null; // Custom price for this barber
  barber?: Barber;
  service?: Service;
}

// ==================== APPOINTMENTS ====================
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED' | 'FAILED';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE' | 'LOYALTY_POINTS' | 'MIXED';
export type CancelledBy = 'CUSTOMER' | 'BARBER' | 'ADMIN';

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  chairId: string | null;
  status: AppointmentStatus;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paymentId: string | null;
  notes: string | null;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  cancelledBy: CancelledBy | null;
  reminderSent: boolean;
  reminder2hSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  customer?: Customer;
  barber?: Barber;
  chair?: Chair;
  services?: AppointmentService[];
  review?: Review;
}

export interface AppointmentService {
  id: string;
  appointmentId: string;
  serviceId: string;
  price: number;
  duration: number;
  sortOrder: number;
  service?: Service;
}

export interface TimeSlot {
  time: string; // "14:30"
  timeFormatted: string; // "14:30"
  available: boolean;
  barberId: string;
  chairId: string | null;
}

// ==================== BARBER SCHEDULE ====================
export interface BarberSchedule {
  id: string;
  barberId: string;
  dayOfWeek: number; // 0-6 (Sunday=0)
  startTime: string; // "09:00"
  endTime: string;   // "19:00"
  breakStart: string | null; // "13:00"
  breakEnd: string | null;   // "14:00"
  isActive: boolean;
}

export interface Chair {
  id: string;
  number: number;
  name: string | null;
  isActive: boolean;
  barberId: string | null;
  barber?: Barber | null;
}

// ==================== REVIEWS ====================
export interface Review {
  id: string;
  customerId: string;
  barberId: string;
  appointmentId: string;
  rating: number; // 1-5
  comment: string | null;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;
  barber?: Barber;
  appointment?: Appointment;
}

// ==================== NOTIFICATIONS ====================
export type NotificationType = 
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_REMINDER_24H'
  | 'APPOINTMENT_REMINDER_2H'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'BARBER_ASSIGNED'
  | 'REVIEW_REQUEST'
  | 'PROMOTION'
  | 'LOYALTY_REWARD'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
}

// ==================== LOYALTY ====================
export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'EXPIRE' | 'ADJUST';

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  appointmentId: string | null;
  type: LoyaltyTransactionType;
  points: number;
  balanceAfter: number;
  description: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  discount: number; // percentage
  benefits: string[];
  color: string;
  icon: string;
}

// ==================== FAVORITES ====================
export interface Favorite {
  id: string;
  userId: string;
  barberId: string | null;
  serviceId: string | null;
  createdAt: Date;
  barber?: Barber;
  service?: Service;
}

// ==================== PORTFOLIO ====================
export interface PortfolioImage {
  id: string;
  barberId: string;
  url: string;
  caption: string | null;
  sortOrder: number;
  createdAt: Date;
}

// ==================== SETTINGS ====================
export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== FORM TYPES ====================
export interface BookingStep1Data {
  serviceIds: string[];
}

export interface BookingStep2Data {
  barberId: string;
  chairId: string | null;
}

export interface BookingStep3Data {
  date: Date;
  time: string; // "14:30"
}

export interface BookingStep4Data {
  phone: string;
  email: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

export interface BookingFormData extends BookingStep1Data, BookingStep2Data, BookingStep3Data, BookingStep4Data {}

// ==================== UI STATE ====================
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalState {
  isOpen: boolean;
  data?: unknown;
}

export interface DrawerState {
  isOpen: boolean;
  position?: 'left' | 'right' | 'bottom';
}

// ==================== HOOKS ====================
export interface UseQueryOptions<T> {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
}

// ==================== SOCKET EVENTS ====================
export interface ServerToClientEvents {
  'availability:update': (data: { date: string; barberId: string; slots: TimeSlot[] }) => void;
  'appointment:status': (data: { appointmentId: string; status: AppointmentStatus; barberId: string }) => void;
  'appointment:new': (appointment: Appointment) => void;
  'notification:new': (notification: Notification) => void;
  'queue:update': (data: { position: number; estimatedWait: number }) => void;
}

export interface ClientToServerEvents {
  'availability:subscribe': (date: string) => void;
  'availability:unsubscribe': (date: string) => void;
  'appointment:track': (appointmentId: string) => void;
  'queue:join': (serviceId: string) => void;
  'queue:leave': () => void;
}

// ==================== PWA ====================
export interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  orientation: 'portrait-primary' | 'landscape-primary';
  scope: string;
  icons: PWAIcon[];
  shortcuts: PWAShorcut[];
  categories: string[];
  screenshots: PWAScreenshot[];
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: 'any' | 'maskable' | 'any maskable';
}

export interface PWAShorcut {
  name: string;
  short_name: string;
  description: string;
  url: string;
  icons: PWAIcon[];
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  form_factor: 'wide' | 'narrow';
}