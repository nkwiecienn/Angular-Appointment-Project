export interface TimeSlot {
  startTime: string;   // '08:00'
  endTime: string;     // '08:30'
  isReserved: boolean;
  isPast: boolean;
  type?: string;       // rodzaj konsultacji (np. 'A', 'B' albo 'Diet', 'Psych' itp.)
  reservationDetails?: string;
}
