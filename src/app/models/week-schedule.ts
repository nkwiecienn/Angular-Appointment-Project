import { DaySchedule } from './day-schedule';

export interface WeekSchedule {
  weekStart: string;
  days: DaySchedule[];
}
