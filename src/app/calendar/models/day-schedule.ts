import { TimeSlot } from './time-slot';

export interface DaySchedule {
  date: string;           
  dayOfWeek: string;      
  reservedCount: number; 
  slots: TimeSlot[];      
}
 