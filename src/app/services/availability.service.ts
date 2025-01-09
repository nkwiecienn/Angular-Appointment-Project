import { Injectable } from '@angular/core';
import { Availability } from '../availability/models/availability';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private availabilityUrl = 'assets/data/availability.json';
  private availabilities$: BehaviorSubject<Availability[]> = new BehaviorSubject<Availability[]>([]);

  constructor(private http: HttpClient) {
    this.loadAvailabilities();
  }

  private loadAvailabilities(): void {
    this.http.get<{ availabilities: Availability[] }>(this.availabilityUrl).subscribe((data) => {
      this.availabilities$.next(data.availabilities || []);
    });
  }

  getAvailabilities(): Observable<Availability[]> {
    return this.availabilities$.asObservable();
  }

  addAvailability(newAvailability: Availability): void {
    const currentAvailabilities = this.availabilities$.getValue();
    const maxId = currentAvailabilities.length > 0
      ? Math.max(...currentAvailabilities.map(a => a.id))
      : 0;
    newAvailability.id = maxId + 1;
    this.availabilities$.next([...currentAvailabilities, newAvailability]);
  }
}
