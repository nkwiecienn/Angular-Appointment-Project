import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Reservation } from '../reservation/models/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl = 'https://localhost:7194/api/Reservations';
  private userUrl = 'https://localhost:7194/api/User';
  private reservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  private userReservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  private doctorsReservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  public reservationsUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  loadReservations(): void {
    this.http.get<Reservation[]>(this.baseUrl).subscribe((reservations) => {
      this.reservations$.next(reservations);
      this.reservationsUpdated.emit();
    });
  }

  loadUsersReservations(): void {
    this.http.get<Reservation[]>(`${this.userUrl}/${localStorage.getItem("userId")}/Reservations`).subscribe((userReservations) => {
      this.userReservations$.next(userReservations);
    });
  }

  loadDoctorReservations(doctorId: number): void {
    this.http.get<Reservation[]>(`${this.baseUrl}/doctor/${doctorId}`).subscribe((reservations) => {
      this.doctorsReservations$.next(reservations);
    });
  }

  getReservations(): Observable<Reservation[]> {
    return this.reservations$.asObservable();
  }

  getUserReservations(): Observable<Reservation[]> {
    return this.userReservations$.asObservable();
  }

  getDoctorReservations(): Observable<Reservation[]> {
    return this.doctorsReservations$.asObservable();
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  addReservation(newReservation: Reservation): Observable<Reservation> {
    const dto = this.mapReservationToDto(newReservation);
    return this.http.post<Reservation>(this.baseUrl, dto).pipe(
      map((createdReservation) => {
        this.loadReservations();
        return createdReservation;
      })
    );
  }

  updateReservation(id: number, updatedReservation: Partial<Reservation>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updatedReservation).pipe(
      map(() => {
        this.loadReservations();
      })
    );
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        this.loadReservations();
        this.loadUsersReservations();
      })
    );
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  getPendingReservations(): Observable<Reservation[]> {
    return this.getUserReservations().pipe(
      map((reservations) => reservations.filter((res) => !res.isReserved))
    );
  }
  
  reserveAllPendingReservations(): Observable<void> {
    return this.getPendingReservations().pipe(
      switchMap((pendingReservations) => {
        const updateRequests = pendingReservations.map((reservation) =>
          this.updateReservation(reservation.id, { isReserved: true })
        );
  
        return forkJoin(updateRequests);
      }),
      map(() => {
        this.loadReservations();
        this.loadReservations();

      }),
      catchError((error) => {
        console.error('Błąd podczas rezerwacji:', error);
        return throwError(() => error);
      })
    );
  }
  
  private mapReservationToDto(reservation: Reservation): any {
    return {
      id: reservation.id,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      length: reservation.length,
      type: reservation.type,
      gender: reservation.gender,
      age: reservation.age,
      details: reservation.details,
      isCanceled: reservation.isCanceled,
      isReserved: reservation.isReserved,
      doctorId: reservation.doctorId,
      userId: localStorage.getItem("userId"),
    };
  }
}
