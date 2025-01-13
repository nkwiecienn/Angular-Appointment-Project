export interface Availability {
  id: number;
  type: 'single-day' | 'range';

  day?: string;

  dateFrom?: string;
  dateTo?: string;
  daysOfWeek?: number[];

  timeRanges: {
    start: string;
    end: string;
  }[];
}
 