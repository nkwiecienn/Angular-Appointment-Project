import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from '../calendar/models/time-slot';
import { Reservation } from '../reservation/models/reservation';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private slots: TimeSlot[] = [];
  private slotsUrl = 'assets/data/schedule.json';

  constructor(private http: HttpClient) {}

  loadSlots(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(this.slotsUrl);
  }

  initializeSlots(slots: TimeSlot[]): void {
    this.slots = slots;
  }

  getSlotsForDate(date: string): TimeSlot[] {
    return this.slots.filter(slot => slot.date === date);
  }

  reserveSlots(reservation: Reservation): void {
    const slotsToReserve = this.getSlotsForReservation(reservation);
    slotsToReserve.forEach(slot => {
      slot.reservationId = reservation.id;
      slot.isReserved = true;
    });
  }

  releaseSlots(reservationId: number): void {
    this.slots.forEach(slot => {
      if (slot.reservationId === reservationId) {
        slot.reservationId = undefined;
        slot.isReserved = false;
      }
    });
  }

  public getSlotsForReservation(reservation: Reservation): TimeSlot[] {
    return this.slots.filter(slot =>
      slot.date === reservation.date &&
      slot.startTime >= reservation.startTime &&
      slot.endTime <= reservation.endTime
    );
  }
}
