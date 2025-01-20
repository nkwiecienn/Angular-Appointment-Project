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
  private reservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  public reservationsUpdated: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  // Pobierz wszystkie rezerwacje
  loadReservations(): void {
    this.http.get<Reservation[]>(this.baseUrl).subscribe((reservations) => {
      this.reservations$.next(reservations);
      this.reservationsUpdated.emit();
    });
  }

  // Pobierz obserwowalne rezerwacje
  getReservations(): Observable<Reservation[]> {
    return this.reservations$.asObservable();
  }

  // Pobierz rezerwację po ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  // Dodaj nową rezerwację
  addReservation(newReservation: Reservation): Observable<Reservation> {
    const dto = this.mapReservationToDto(newReservation);
    return this.http.post<Reservation>(this.baseUrl, dto).pipe(
      map((createdReservation) => {
        this.loadReservations(); // Odśwież listę rezerwacji
        return createdReservation;
      })
    );
  }

  // Zaktualizuj istniejącą rezerwację
  updateReservation(id: number, updatedReservation: Partial<Reservation>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updatedReservation).pipe(
      map(() => {
        this.loadReservations(); // Odśwież listę rezerwacji
      })
    );
  }

  // Usuń rezerwację
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        this.loadReservations(); // Odśwież listę rezerwacji
      })
    );
  }

  // Pobierz rezerwacje oczekujące (nieopłacone)
  getPendingReservations(): Observable<Reservation[]> {
    return this.getReservations().pipe(
      map((reservations) => reservations.filter((res) => !res.isReserved))
    );
  }
  
  reserveAllPendingReservations(): Observable<void> {
    return this.getPendingReservations().pipe(
      switchMap((pendingReservations) => {
        // Dla każdej rezerwacji aktualizujemy isReserved na true
        const updateRequests = pendingReservations.map((reservation) =>
          this.updateReservation(reservation.id, { isReserved: true })
        );
  
        return forkJoin(updateRequests); // Uruchamiamy wszystkie żądania równolegle
      }),
      map(() => {
        this.loadReservations(); // Odświeżamy listę rezerwacji
      }),
      catchError((error) => {
        console.error('Błąd podczas rezerwacji:', error);
        return throwError(() => error);
      })
    );
  }
  

  // Mapowanie DTO -> Model
  private mapDtoToReservation(dto: any): Reservation {
    return {
      id: dto.id,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      length: dto.length,
      type: dto.type,
      patientName: dto.patientName,
      patientSurname: dto.patientSurname,
      gender: dto.gender,
      age: dto.age,
      details: dto.details,
      isCanceled: dto.isCanceled,
      isReserved: dto.isReserved,
    };
  }

  // Mapowanie Model -> DTO
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
      userId: 1, // TODO: Ustawienie dynamicznego ID użytkownika
    };
  }
}
