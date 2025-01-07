export interface TimeSlot {
    startTime: string;   // np. '08:00'
    endTime: string;     // np. '08:30'
    isReserved: boolean;
    isPast: boolean;
    type?: string;       // rodzaj konsultacji
    reservationDetails?: string;
  }
  