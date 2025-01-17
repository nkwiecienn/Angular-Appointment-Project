export interface TimeSlot {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  isReserved: boolean;
  isPast: boolean;
  reservationId?: number;
}
 