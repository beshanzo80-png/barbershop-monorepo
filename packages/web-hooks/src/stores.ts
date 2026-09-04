import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Customer, Barber, Appointment, Service } from '@barbershop/types';

// ==================== AUTH STORE ====================
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false }),
      
      setUser: (user) => 
        set({ user, isAuthenticated: !!user }),
      
      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      
      setLoading: (isLoading) => 
        set({ isLoading }),
    }),
    {
      name: 'barbershop-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ==================== BOOKING STORE ====================
interface BookingStep1Data {
  serviceIds: string[];
}

interface BookingStep2Data {
  barberId: string;
  chairId: string | null;
}

interface BookingStep3Data {
  date: Date | null;
  time: string | null;
}

interface BookingStep4Data {
  phone: string;
  email: string;
  notes: string;
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE' | 'LOYALTY_POINTS' | 'MIXED';
}

interface BookingState {
  // Steps
  step: 1 | 2 | 3 | 4;
  step1: BookingStep1Data;
  step2: BookingStep2Data;
  step3: BookingStep3Data;
  step4: BookingStep4Data;
  
  // Actions
  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Step 1
  setServices: (serviceIds: string[]) => void;
  toggleService: (serviceId: string) => void;
  
  // Step 2
  setBarber: (barberId: string, chairId?: string) => void;
  
  // Step 3
  setDateTime: (date: Date, time: string) => void;
  
  // Step 4
  setContactInfo: (data: Partial<BookingStep4Data>) => void;
  
  // Reset
  reset: () => void;
  
  // Computed
  canProceedStep1: () => boolean;
  canProceedStep2: () => boolean;
  canProceedStep3: () => boolean;
  canProceedStep4: () => boolean;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
}

const initialStep1: BookingStep1Data = { serviceIds: [] };
const initialStep2: BookingStep2Data = { barberId: '', chairId: null };
const initialStep3: BookingStep3Data = { date: null, time: null };
const initialStep4: BookingStep4Data = { 
  phone: '', 
  email: '', 
  notes: '', 
  paymentMethod: 'CASH' 
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      step: 1,
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
      step4: initialStep4,
      
      setStep: (step) => set({ step }),
      
      nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) as 1 | 2 | 3 | 4 })),
      
      prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) as 1 | 2 | 3 | 4 })),
      
      setServices: (serviceIds) => set({ step1: { serviceIds } }),
      
      toggleService: (serviceId) => set((state) => ({
        step1: {
          serviceIds: state.step1.serviceIds.includes(serviceId)
            ? state.step1.serviceIds.filter(id => id !== serviceId)
            : [...state.step1.serviceIds, serviceId]
        }
      })),
      
      setBarber: (barberId, chairId) => set({ step2: { barberId, chairId } }),
      
      setDateTime: (date, time) => set({ step3: { date, time } }),
      
      setContactInfo: (data) => set((state) => ({ step4: { ...state.step4, ...data } })),
      
      reset: () => set({ 
        step: 1, 
        step1: initialStep1, 
        step2: initialStep2, 
        step3: initialStep3, 
        step4: initialStep4 
      }),
      
      canProceedStep1: () => get().step1.serviceIds.length > 0,
      
      canProceedStep2: () => !!get().step2.barberId,
      
      canProceedStep3: () => !!get().step3.date && !!get().step3.time,
      
      canProceedStep4: () => {
        const { step4 } = get();
        return !!step4.phone && !!step4.email;
      },
      
      getTotalDuration: () => {
        // This would need services data - placeholder
        return 0;
      },
      
      getTotalPrice: () => {
        // This would need services data - placeholder
        return 0;
      },
    }),
    {
      name: 'barbershop-booking',
      storage: createJSONStorage(() => sessionStorage), // Session storage for booking flow
      partialize: (state) => ({
        step: state.step,
        step1: state.step1,
        step2: state.step2,
        step3: state.step3,
        step4: state.step4,
      }),
    }
  )
);

// ==================== APPOINTMENTS STORE ====================
interface AppointmentsState {
  upcoming: Appointment[];
  past: Appointment[];
  isLoading: boolean;
  error: string | null;
  
  setAppointments: (upcoming: Appointment[], past: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  upcoming: [],
  past: [],
  isLoading: false,
  error: null,
  
  setAppointments: (upcoming, past) => set({ upcoming, past, isLoading: false }),
  
  addAppointment: (appointment) => set((state) => ({
    upcoming: [appointment, ...state.upcoming],
  })),
  
  updateAppointment: (id, data) => set((state) => ({
    upcoming: state.upcoming.map(a => a.id === id ? { ...a, ...data } : a),
    past: state.past.map(a => a.id === id ? { ...a, ...data } : a),
  })),
  
  removeAppointment: (id) => set((state) => ({
    upcoming: state.upcoming.filter(a => a.id !== id),
    past: state.past.filter(a => a.id !== id),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
}));

// ==================== NOTIFICATIONS STORE ====================
interface NotificationState {
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }>;
  unreadCount: number;
  
  addNotification: (notification: Omit<NotificationState['notifications'][0], 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: NotificationState['notifications']) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => set((state) => ({
        notifications: [{ ...notification, id: crypto.randomUUID() }, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: state.notifications.find(n => n.id === id && !n.read) 
          ? state.unreadCount - 1 
          : state.unreadCount,
      })),
      
      setNotifications: (notifications) => set({ 
        notifications, 
        unreadCount: notifications.filter(n => !n.read).length 
      }),
    }),
    {
      name: 'barbershop-notifications',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ==================== FAVORITES STORE ====================
interface FavoritesState {
  barbers: string[];
  services: string[];
  
  toggleBarber: (barberId: string) => void;
  toggleService: (serviceId: string) => void;
  isBarberFavorite: (barberId: string) => boolean;
  isServiceFavorite: (serviceId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      barbers: [],
      services: [],
      
      toggleBarber: (barberId) => set((state) => ({
        barbers: state.barbers.includes(barberId)
          ? state.barbers.filter(id => id !== barberId)
          : [...state.barbers, barberId],
      })),
      
      toggleService: (serviceId) => set((state) => ({
        services: state.services.includes(serviceId)
          ? state.services.filter(id => id !== serviceId)
          : [...state.services, serviceId],
      })),
      
      isBarberFavorite: (barberId) => get().barbers.includes(barberId),
      
      isServiceFavorite: (serviceId) => get().services.includes(serviceId),
    }),
    {
      name: 'barbershop-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);