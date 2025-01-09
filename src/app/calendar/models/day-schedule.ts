import { TimeSlot } from './time-slot';

export interface DaySchedule {
  date: string;           // '2025-01-06'
  dayOfWeek: string;      // 'Poniedziałek'
  reservedCount: number;  // np. 2
  slots: TimeSlot[];      // tablica slotów (np. 12 slotów po 30min)
}
