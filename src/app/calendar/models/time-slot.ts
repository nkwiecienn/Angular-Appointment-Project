export interface TimeSlot {
  startTime: string;
  endTime: string;
  isReserved: boolean;
  isPast: boolean;
  type?: string;
  reservationDetails?: string;
}
