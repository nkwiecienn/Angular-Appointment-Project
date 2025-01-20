import { Injectable } from '@angular/core';
import { Reservation } from '../reservation/models/reservation';
import { TimeSlot } from '../calendar/models/time-slot';
import { ReservationService } from './reservation.service';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  constructor(private reservationService: ReservationService) {}

  generateSlotsForDay(
    date: string,
    reservations: Reservation[],
    startHour: number,
    endHour: number,
    slotLength: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;
  
    for (let minutes = startMinutes; minutes < endMinutes; minutes += slotLength) {
      const slotStart = this.formatHHMM(minutes);
      const slotEnd = this.formatHHMM(minutes + slotLength);
  
      const reservation = reservations.find(
        (r) =>
          r.date === date &&
          this.calculateMinutes(r.startTime) <= minutes &&
          this.calculateMinutes(r.endTime) > minutes
      );
  
      slots.push({
        date,
        startTime: slotStart,
        endTime: slotEnd,
        isReserved: !!reservation,
        isPast: new Date(`${date}T${slotStart}`) < new Date(),
        reservationId: reservation?.id,
      });
    }
  
    return slots;
  }
  
  generateSlotsForWeek(
    startDate: string,
    reservations: Reservation[],
    startHour: number,
    endHour: number,
    slotLength: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startOfWeek = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const dailySlots = this.generateSlotsForDay(dateStr, reservations, startHour, endHour, slotLength);
      slots.push(...dailySlots);
    }

    return slots;
  }

  getSlotsForDate(date: string, startHour: number, endHour: number, slotLength: number): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      this.reservationService.getReservations().subscribe((reservations) => {
        const slots = this.generateSlotsForDay(date, reservations, startHour, endHour, slotLength);
        resolve(slots);
      });
    });
  }

  private calculateMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private formatHHMM(minutes: number): string {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }
}
