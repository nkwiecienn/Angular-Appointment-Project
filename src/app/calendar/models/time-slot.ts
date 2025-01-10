export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isReserved: boolean;
  isPast: boolean;
  reservationId?: number;
}
