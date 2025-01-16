import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability } from '../availability/models/availability';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private baseUrl = 'https://localhost:7194/api/Availability'; // URL backendu

  constructor(private http: HttpClient) {}

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
