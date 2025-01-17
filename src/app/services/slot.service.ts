import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from '../calendar/models/time-slot';
import { Reservation } from '../reservation/models/reservation';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  private baseUrl = 'https://localhost:7194/api'; // URL backendu
  private slots: TimeSlot[] = [];

  constructor(private http: HttpClient) {}

  // Pobierz wszystkie sloty
  getSlots(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.baseUrl}/TimeSlot`);
  }

  // Pobierz sloty dla konkretnej daty
  getSlotsForDate(date: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.baseUrl}/TimeSlot?date=${date}`);
  }

  getSlotsForReservation(reservation: Reservation): TimeSlot[] {
    return this.slots.filter((slot) => {
      const isInDate = slot.date === reservation.date;
      const isInTimeRange =
        slot.startTime >= reservation.startTime && slot.endTime <= reservation.endTime;

      return isInDate && isInTimeRange;
    });
  }

  // Zarezerwuj slot, przypisując do niego reservationId
  reserveSlot(slotId: number, reservationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/TimeSlot/${slotId}/reserve`, {
      reservationId,
    });
  }

  // Zwolnij slot, ustawiając isReserved na false i usuwając reservationId
  releaseSlot(slotId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/TimeSlot/${slotId}/release`, {});
  }

  // Pobierz wszystkie sloty z backendu i zapisz je lokalnie
  initializeSlots(): Observable<TimeSlot[]> {
    return new Observable<TimeSlot[]>((observer) => {
      this.http.get<TimeSlot[]>(this.baseUrl).subscribe({
        next: (data) => {
          this.slots = data; // Zapisz sloty w pamięci
          observer.next(data);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  // Pobierz sloty dla tygodnia (filtruj lokalnie)
  getSlotsForWeek(startDate: string): TimeSlot[] {
    const startOfWeek = new Date(startDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Filtrowanie slotów w pamięci
    return this.slots.filter((slot) => {
      const slotDate = new Date(slot.date);
      return slotDate >= startOfWeek && slotDate < endOfWeek;
    });
  }
}
