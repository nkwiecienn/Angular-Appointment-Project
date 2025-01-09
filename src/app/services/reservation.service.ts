import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservation } from '../reservation/models/reservation';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationUrl = "assets/data/reservation.json";
  private reservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);

  constructor(private http: HttpClient) {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.http.get<{ reservations: Reservation[] }>(this.reservationUrl).subscribe((data) => {
      this.reservations$.next(data.reservations || []);
    });
  }

  getReservations(): Observable<Reservation[]> {
    return this.reservations$.asObservable();
  }

  addReservation(newReservation: Reservation): void {
    const currentReservations = this.reservations$.getValue();
    const maxId = currentReservations.length > 0
      ? Math.max(...currentReservations.map(r => r.id))
      : 0;
    newReservation.id = maxId + 1;
    this.reservations$.next([...currentReservations, newReservation]);
  }
}
 