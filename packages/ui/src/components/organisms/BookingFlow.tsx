'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../atoms';
import { Progress } from '../atoms';
import { 
  Scissors, 
  UserCheck, 
  Clock, 
  CheckCircle 
} from 'lucide-react';

interface BookingFlowProps {
  currentStep: number; // 1-4
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isSubmitting?: boolean;
  stepData?: {
    servicesCount?: number;
    barberName?: string;
    dateTime?: string;
    totalPrice?: number;
  };
}

const STEPS = [
  { id: 1, label: 'Hizmet', icon: Scissors },
  { id: 2, label: 'Berber', icon: UserCheck },
  { id: 3, label: 'Zaman', icon: Clock },
  { id: 4, label: 'Onay', icon: CheckCircle },
] as const;

export function BookingFlow({ 
  currentStep, 
  onNext, 
  onBack, 
  onSubmit, 
  canProceed, 
  isSubmitting,
  stepData 
}: BookingFlowProps) {
  const progress = (currentStep / 4) * 100;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-[290] bg-bg-elevated border-t border-border-subtle safe-area-inset-bottom:pb-safe">
      {/* Progress Bar */}
      <div className="h-1 bg-bg-tertiary overflow-hidden">
        <Progress value={progress} className="h-full bg-gold-primary" />
      </div>
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between px-4 py-3">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => {
                if (step.id <= currentStep) {
                  // Could implement step jumping here
                }
              }}
              disabled={step.id > currentStep}
              className={cn(
                'flex flex-col items-center gap-1 flex-1 transition-all duration-300',
                step.id < currentStep
                  ? 'text-gold-primary'
                  : step.id === currentStep
                  ? 'text-text-primary'
                  : 'text-text-muted'
              )}
              aria-current={step.id === currentStep ? 'step' : undefined}
            >
              <div className={cn(
                'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                step.id < currentStep
                  ? 'bg-gold-primary border-gold-primary text-text-on-gold'
                  : step.id === currentStep
                  ? 'bg-bg-tertiary border-gold-primary text-gold-primary'
                  : 'bg-bg-secondary border-border-default text-text-muted'
              )}>
                {step.id < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <span className="text-[10px] font-medium mt-1">{step.label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-1 mx-1 rounded transition-all',
                index + 1 < currentStep ? 'bg-gold-primary' : 'bg-border-subtle'
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex items-center gap-3">
        {currentStep > 1 && (
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1 sm:flex-none"
          >
            Geri
          </Button>
        )}
        
        {currentStep < 4 ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'İlerliyor...' : 'Devam Et'}
          </Button>
        ) : (
          <Button
            variant="gold"
            size="lg"
            fullWidth
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Onaylanıyor...' : 'Randevuyu Onayla'}
          </Button>
        )}
      </div>

      {/* Step Summary */}
      {stepData && (
        <div className="px-4 pb-3 border-t border-border-subtle bg-bg-secondary/50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {stepData.servicesCount !== undefined && (
              <div className="flex items-center gap-1 text-text-muted">
                <Scissors className="h-3 w-3" />
                <span>{stepData.servicesCount} hizmet</span>
              </div>
            )}
            {stepData.barberName && (
              <div className="flex items-center gap-1 text-text-muted">
                <UserCheck className="h-3 w-3" />
                <span className="truncate">{stepData.barberName}</span>
              </div>
            )}
            {stepData.dateTime && (
              <div className="flex items-center gap-1 text-text-muted col-span-2">
                <Clock className="h-3 w-3" />
                <span>{stepData.dateTime}</span>
              </div>
            )}
            {stepData.totalPrice !== undefined && (
              <div className="flex items-center justify-end gap-1 col-span-2">
                <span className="text-text-muted">Toplam:</span>
                <span className="font-bold text-gold-primary">{stepData.totalPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}