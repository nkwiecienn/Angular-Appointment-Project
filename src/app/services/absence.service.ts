import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Absence } from '../absence/models/absence';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private baseUrl = 'https://localhost:7194/api/Absence'; // Adres API backendu

  constructor(private http: HttpClient) {}

  // Pobierz wszystkie absencje
  getAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${this.baseUrl}`);
  }

  // Dodaj nową absencję
  addAbsence(newAbsence: { day: string; userId: number }): Observable<Absence> {
    return this.http.post<Absence>(`${this.baseUrl}`, newAbsence);
  }

  // Usuń absencję
  deleteAbsence(absenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${absenceId}`);
  }
}
