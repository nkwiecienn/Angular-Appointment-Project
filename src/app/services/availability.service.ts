import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Availability } from '../availability/models/availability';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private baseUrl = 'https://localhost:7194/api/Availability'; // URL backendu
  private userUrl = 'https://localhost:7194/api/User';
  private userAvailabilities$ = new BehaviorSubject<Availability[]>([]);
  public availabilitiesUpdated = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  loadUsersAvailabilities(): void {
    this.http.get<Availability[]>(`${this.userUrl}/${localStorage.getItem("userId")}/Availabilities`).subscribe((userAvailabilities) => {
      this.userAvailabilities$.next(userAvailabilities);
      this.availabilitiesUpdated.emit();
    });
  }

  getUserAvailabilities(): Observable<Availability[]> {
    return this.userAvailabilities$.asObservable();
  }

  getDoctorAvailabilities(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.userUrl}/${userId}/Availabilities`);
  }  

  // Pobierz wszystkie dostępności
  getAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.baseUrl}`);
  }

  // Dodaj nową dostępność
  addAvailability(availability: Availability): Observable<Availability> {
    return this.http.post<Availability>(`${this.baseUrl}`, availability);
  }

  // Zaktualizuj istniejącą dostępność
  updateAvailability(id: number, availability: Availability): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, availability);
  }

  // Usuń dostępność
  deleteAvailability(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
