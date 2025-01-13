import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Reservation } from '../reservation/models/reservation';
import { HttpClient } from '@angular/common/http';
import { SlotService } from './slot.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationUrl = "assets/data/reservation.json"; 
  private reservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  public reservationsUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private slotService: SlotService) {
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
    this.reservationsUpdated.emit();
  }

  getReservationById(id: number): Reservation | undefined {
    return this.reservations$.getValue().find(reservation => reservation.id === id);
  }

  cancelReservation(id: number): void {
    const reservation = this.getReservationById(id);
    if (reservation) {
      reservation.isCanceled = true;
    }
  }

  getPendingReservations(): Reservation[] {
    return this.reservations$.getValue().filter(reservation => !reservation.isReserved);
  }
  
  removeReservation(reservationId: number): void {
    const currentReservations = this.reservations$.getValue();
    this.reservations$.next(currentReservations.filter(res => res.id !== reservationId));
  }
  
  reserveAllPending(): void {
    // const currentReservations = this.reservations$.getValue();
    // const updatedReservations = currentReservations.map(reservation => {
    //   if (!reservation.isReserved) {
    //     reservation.isReserved = true;
    //     this.assignReservationToSlots(reservation);
    //   }
    //   return reservation;
    // });
    // this.reservations$.next(updatedReservations);
  }
  
  
  private assignReservationToSlots(reservation: Reservation): void {
    // const slots = this.slotService.getSlotsForReservation(reservation);
    // slots.forEach(slot => {
    //   slot.isReserved = true;
    //   slot.reservationId = reservation.id;
    // });
  }
  
}
 