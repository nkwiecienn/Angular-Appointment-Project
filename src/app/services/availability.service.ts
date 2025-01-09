import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Availability } from '../availability/models/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private availabilityUrl = 'assets/data/availability.json';

  private availabilities: Availability[] = [];

  // constructor(private http: HttpClient) {}
  constructor(private http: HttpClient) {
    // Automatyczne ładowanie dostępności na starcie
    this.loadAvailabilities().subscribe();
  }

  loadAvailabilities(): Observable<Availability[]> {
    if (this.availabilities.length > 0) {
      return of(this.availabilities);
    }
    return this.http
      .get<{ availabilities: Availability[] }>(this.availabilityUrl)
      .pipe(
        map(data => {
          this.availabilities = data.availabilities || [];
          return this.availabilities;
        })
      );
  }

  getAvailabilities(): Availability[] {
    return this.availabilities;
  }

  addAvailability(newAvail: Availability): void {
    const maxId = this.availabilities.length > 0 
      ? Math.max(...this.availabilities.map(a => a.id)) 
      : 0;
    newAvail.id = maxId + 1;
    this.availabilities.push(newAvail);
  }
}
