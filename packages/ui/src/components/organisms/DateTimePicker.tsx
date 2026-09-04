'use client';

import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { cn, formatDate, formatTime, getShortDayName } from '@/lib/utils';
import { Button } from '../atoms';
import { TimeSlot } from '../molecules';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { addDays, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isBefore, isAfter, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DateTimePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date) => void;
  availableSlots: { time: string; available: boolean; barberId: string }[];
  onSlotSelect: (time: string) => void;
  selectedSlot?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  loading?: boolean;
  showTimeSlots?: boolean;
}

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function DateTimePicker({ 
  selectedDate, 
  onDateChange, 
  availableSlots, 
  onSlotSelect, 
  selectedSlot,
  minDate = new Date(),
  maxDate = addDays(new Date(), 60),
  disabledDates = [],
  loading,
  showTimeSlots = true 
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate || new Date());
  
  // Ensure currentMonth is within bounds
  React.useEffect(() => {
    if (isBefore(currentMonth, startOfMonth(minDate))) {
      setCurrentMonth(startOfMonth(minDate));
    } else if (isAfter(currentMonth, endOfMonth(maxDate))) {
      setCurrentMonth(startOfMonth(maxDate));
    }
  }, [currentMonth, minDate, maxDate]);

  const handleDayClick = (day: Date, modifiers: DayPickerProps['modifiers']) => {
    if (modifiers.disabled) return;
    onDateChange(day);
  };

  const isDateDisabled = (day: Date) => {
    if (isBefore(day, startOfDay(minDate))) return true;
    if (isAfter(day, endOfDay(maxDate))) return true;
    return disabledDates.some(d => isSameDay(d, day));
  };

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  const canGoPrev = !isBefore(startOfMonth(currentMonth), startOfMonth(minDate));
  const canGoNext = !isAfter(startOfMonth(currentMonth), startOfMonth(maxDate));

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} disabled={!canGoPrev} aria-label="Önceki ay">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center">
          <h3 className="font-semibold text-text-primary">
            {MONTHS_TR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} disabled={!canGoNext} aria-label="Sonraki ay">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar */}
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        month={currentMonth}
        fromDate={minDate}
        toDate={maxDate}
        disabledDays={isDateDisabled}
        locale={tr}
        classNames={{
          root: 'w-full',
          month: 'space-y-2',
          caption: 'flex items-center justify-between',
          caption_label: 'text-lg font-semibold text-text-primary',
          nav: 'flex items-center gap-1',
          nav_button: cn(
            'p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary',
            'disabled:opacity-50 disabled:pointer-events-none'
          ),
          table: 'w-full border-collapse',
          head: 'border-b border-border-subtle',
          head_row: 'flex',
          head_cell: 'w-[calc(100%/7)] text-center text-xs font-medium text-text-muted py-2',
          row: 'flex',
          cell: 'w-[calc(100%/7)] h-10',
          day: cn(
            'relative flex h-full w-full items-center justify-center text-sm font-medium',
            'rounded-full transition-all duration-200',
            'hover:bg-bg-tertiary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary'
          ),
          day_button: cn(
            'h-9 w-9',
            'data-[selected]:bg-gold-primary data-[selected]:text-text-on-gold',
            'data-[today]:bg-gold-subtle data-[today]:text-gold-primary data-[today]:font-bold',
            'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:text-text-muted',
            'data-[outside]:opacity-30'
          ),
          today_button: 'text-gold-primary font-bold',
          selected: 'bg-gold-primary text-text-on-gold',
        }}
        weekdayNames={getShortDayName}
        numberOfMonths={1}
        showOutsideDays={true}
        fixedWeeks={true}
      />

      {/* Time Slots */}
      {showTimeSlots && selectedDate && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {formatDate(selectedDate, 'EEEE, d MMMM', { locale: tr })}
            </h4>
            {loading && (
              <div className="animate-spin h-5 w-5 border-2 border-gold-primary border-t-transparent rounded-full" />
            )}
          </div>
          
          {availableSlots.length === 0 ? (
            <div className="text-center py-6 text-text-muted bg-bg-tertiary/50 rounded-lg">
              <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Bu gün için müsait saat bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {availableSlots.map((slot) => (
                <TimeSlot
                  key={`${slot.barberId}-${slot.time}`}
                  time={slot.time}
                  selected={selectedSlot === slot.time}
                  available={slot.available}
                  onSelect={onSlotSelect}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}