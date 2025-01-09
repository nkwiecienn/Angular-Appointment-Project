import { Injectable } from '@angular/core';
import { Absence } from '../absence/models/absence';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {
  private absenceUrl = 'assets/data/absence.json';
  private absences$: BehaviorSubject<Absence[]> = new BehaviorSubject<Absence[]>([]);

  constructor(private http: HttpClient) {
    this.loadAbsences();
  }

  private loadAbsences(): void {
    this.http.get<{ absences: Absence[] }>(this.absenceUrl).subscribe((data) => {
      this.absences$.next(data.absences || []);
    });
  }

  getAbsences(): Observable<Absence[]> {
    return this.absences$.asObservable();
  }

  addAbsence(newAbsence: Absence): void {
    const currentAbsences = this.absences$.getValue();
    const maxId = currentAbsences.length > 0
      ? Math.max(...currentAbsences.map(a => a.id))
      : 0;
    newAbsence.id = maxId + 1;
    this.absences$.next([...currentAbsences, newAbsence]);
  }
}
