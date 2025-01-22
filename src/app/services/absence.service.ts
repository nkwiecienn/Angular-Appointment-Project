import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Absence } from '../absence/models/absence';

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private baseUrl = 'https://localhost:7194/api/Absence'; // Adres API backendu
  private userUrl = 'https://localhost:7194/api/User';
  private userAbsences$: BehaviorSubject<Absence[]> = new BehaviorSubject<Absence[]>([]);

  constructor(private http: HttpClient) {}

  loadUserAbsences(): void {
    this.http.get<Absence[]>(`${this.userUrl}/${localStorage.getItem("userId")}/Absences`).subscribe((absences) => {
      this.userAbsences$.next(absences);
    });
  }

  getUserAbsences(): Observable<Absence[]> {
    return this.userAbsences$.asObservable();
  }

  getDoctorAbsences(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.userUrl}/${userId}/Absences`);
  }  

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
