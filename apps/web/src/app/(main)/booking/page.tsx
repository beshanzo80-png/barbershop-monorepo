'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { BookingFlow, ServiceSelector, BarberSelector, DateTimePicker } from '@barbershop/ui';
import { useBookingStore } from '@barbershop/web-hooks';
import { useServices, useBarbers, useBarberAvailability } from '@barbershop/web-hooks';
import { formatDate, formatTime } from '@barbershop/utils';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const MOCK_BARBERS = [
  { id: '1', user: { id: '1', name: 'Ahmet Usta', avatar: null, phone: '', email: '', role: 'BARBER' as const, isActive: true, createdAt: '', updatedAt: '' }, specialties: ['Klasik Kesim', 'Fade', 'Sakal Tasarımı'], rating: 4.9, reviewCount: 127, isActive: true },
  { id: '2', user: { id: '2', name: 'Mehmet Usta', avatar: null, phone: '', email: '', role: 'BARBER' as const, isActive: true, createdAt: '', updatedAt: '' }, specialties: ['Sakal Tasarımı', 'Geleneksel Tıraş', 'Cilt Bakımı'], rating: 4.8, reviewCount: 89, isActive: true },
  { id: '3', user: { id: '3', name: 'Can Usta', avatar: null, phone: '', email: '', role: 'BARBER' as const, isActive: true, createdAt: '', updatedAt: '' }, specialties: ['Modern Kesim', 'Saç Boyama', 'Creative Styles'], rating: 4.7, reviewCount: 56, isActive: true },
];

const MOCK_SERVICES = [
  { id: '1', name: 'Saç Kesimi', description: 'Klasik veya modern saç kesimi', duration: 30, price: 150, category: 'HAIRCUT' as const, isActive: true, sortOrder: 1 },
  { id: '2', name: 'Sakal Tıraşı', description: 'Geleneksel usta tıraşı', duration: 20, price: 80, category: 'BEARD' as const, isActive: true, sortOrder: 2 },
  { id: '3', name: 'Saç + Sakal Kombo', description: 'Saç kesimi ve sakal tıraşı paketi', duration: 45, price: 200, category: 'PACKAGE' as const, isActive: true, sortOrder: 3 },
  { id: '4', name: 'Saç Boyama', description: 'Profesyonel saç boyama', duration: 45, price: 180, category: 'COLORING' as const, isActive: true, sortOrder: 4 },
  { id: '5', name: 'Cilt Bakımı', description: 'Derin temizlik ve nemlendirme', duration: 25, price: 120, category: 'TREATMENT' as const, isActive: true, sortOrder: 5 },
];

export default function BookingPage() {
  const router = useRouter();
  const { 
    step, 
    step1, step2, step3, step4,
    setStep, nextStep, prevStep,
    setServices, toggleService, setBarber, setDateTime, setContactInfo,
    canProceedStep1, canProceedStep2, canProceedStep3, canProceedStep4,
    reset
  } = useBookingStore();

  const [selectedBarberId, setSelectedBarberId] = React.useState<string>('');
  const [selectedSlot, setSelectedSlot] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Mock data for demo
  const services = MOCK_SERVICES;
  const barbers = MOCK_BARBERS;

  // Calculate total duration and price
  const selectedServicesData = services.filter(s => step1.serviceIds.includes(s.id));
  const totalDuration = selectedServicesData.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServicesData.reduce((acc, s) => acc + s.price, 0);

  // Mock availability
  const mockSlots = [
    { time: '09:00', available: true, barberId: '1' },
    { time: '09:30', available: true, barberId: '1' },
    { time: '10:00', available: false, barberId: '1' },
    { time: '10:30', available: true, barberId: '1' },
    { time: '11:00', available: true, barberId: '1' },
    { time: '14:00', available: true, barberId: '1' },
    { time: '14:30', available: true, barberId: '1' },
    { time: '15:00', available: true, barberId: '1' },
    { time: '15:30', available: false, barberId: '1' },
    { time: '16:00', available: true, barberId: '1' },
    { time: '16:30', available: true, barberId: '1' },
    { time: '17:00', available: true, barberId: '1' },
  ];

  const handleSubmit = async () => {
    if (!canProceedStep4()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      reset();
      router.push('/appointments?success=true');
    } catch (error) {
      // Error handled by toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ServiceSelector
            services={services}
            selectedServices={step1.serviceIds}
            onServiceToggle={toggleService}
            multiSelect={true}
            maxSelection={5}
          />
        );
      
      case 2:
        return (
          <BarberSelector
            barbers={barbers as any}
            selectedBarberId={step2.barberId}
            onBarberSelect={(id) => {
              setBarber(id);
              setSelectedBarberId(id);
              setSelectedSlot('');
            }}
            variant="grid"
            showAvailability={true}
          />
        );
      
      case 3:
        return (
          <DateTimePicker
            selectedDate={step3.date}
            onDateChange={(date) => setDateTime(date, step3.time || '')}
            availableSlots={mockSlots}
            onSlotSelect={setSelectedSlot}
            selectedSlot={selectedSlot}
            showTimeSlots={!!step2.barberId}
          />
        );
      
      case 4:
        return (
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gold-subtle/30 border border-gold-primary/30 rounded-lg p-4">
              <h3 className="font-semibold text-gold-dark mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Sipariş Özeti
              </h3>
              
              <div className="space-y-2">
                {selectedServicesData.map((service) => (
                  <div key={service.id} className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{service.price.toLocaleString('tr-TR')} ₺</span>
                  </div>
                ))}
                
                <div className="border-t border-gold-primary/30 pt-2 flex justify-between font-semibold">
                  <span>Toplam</span>
                  <span className="text-gold-primary">{totalPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
                
                {step2.barberId && (
                  <div className="mt-3 pt-3 border-t border-gold-primary/30 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Berber:</span>
                      <span className="font-medium">{barbers.find(b => b.id === step2.barberId)?.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Tarih:</span>
                      <span className="font-medium">{step3.date ? formatDate(step3.date, 'd MMMM yyyy', { locale: 'tr' }) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Saat:</span>
                      <span className="font-medium">{step3.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Süre:</span>
                      <span className="font-medium">{totalDuration} dk</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">İletişim Bilgileri</h3>
              
              <input
                type="tel"
                placeholder="+905551234567"
                value={step4.phone}
                onChange={(e) => setContactInfo({ phone: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary"
                inputMode="tel"
              />
              
              <input
                type="email"
                placeholder="ornek@email.com"
                value={step4.email}
                onChange={(e) => setContactInfo({ email: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary"
              />
              
              <textarea
                placeholder="Not (Opsiyonel) - Örn: Sakal şekli korunsun..."
                value={step4.notes}
                onChange={(e) => setContactInfo({ notes: e.target.value })}
                className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-gold-primary min-h-[80px] resize-none"
                rows={3}
              />

              <div className="pt-4 border-t border-border-subtle">
                <h4 className="font-medium mb-3">Ödeme Yöntemi</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(['CASH', 'CARD', 'ONLINE'] as const).map((method) => (
                    <label
                      key={method}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        step4.paymentMethod === method
                          ? 'border-gold-primary bg-gold-subtle/30'
                          : 'border-border-default hover:border-gold-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={step4.paymentMethod === method}
                        onChange={() => setContactInfo({ paymentMethod: method })}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-1">
                        {method === 'CASH' && <span className="text-2xl">💵</span>}
                        {method === 'CARD' && <span className="text-2xl">💳</span>}
                        {method === 'ONLINE' && <span className="text-2xl">🌐</span>}
                        <span className="font-medium">{method === 'ONLINE' ? 'Online (%10 indirim)' : method}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="container pb-28 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Randevu Al</h1>
          <p className="text-text-secondary">4 adımda randevunuzu tamamlayın</p>
        </div>

        {/* Step Content */}
        <div className="animate-in slide-in-from-bottom-2 fade-in-0 duration-300">
          {renderStep()}
        </div>
      </div>

      {/* Booking Flow Bottom Bar */}
      <BookingFlow
        currentStep={step}
        onNext={nextStep}
        onBack={prevStep}
        onSubmit={handleSubmit}
        canProceed={
          step === 1 ? canProceedStep1() :
          step === 2 ? canProceedStep2() :
          step === 3 ? canProceedStep3() :
          canProceedStep4()
        }
        isSubmitting={isSubmitting}
        stepData={{
          servicesCount: step1.serviceIds.length,
          barberName: barbers.find(b => b.id === step2.barberId)?.user.name,
          dateTime: step3.date && step3.time ? `${formatDate(step3.date, 'd MMM', { locale: 'tr' })} • ${step3.time}` : undefined,
          totalPrice,
        }}
      />
    </div>
  );
}