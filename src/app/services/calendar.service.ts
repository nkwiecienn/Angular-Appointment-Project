// src/app/services/calendar.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeekSchedule } from '../models/week-schedule';

@Injectable({
  providedIn: 'root' // standalone: 'root' => globalny zasięg
})
export class CalendarService {

  private scheduleUrl = 'assets/data/schedule.json';

  constructor(private http: HttpClient) {}

  getSchedule(): Observable<WeekSchedule> {
    return this.http.get<WeekSchedule>(this.scheduleUrl);
  }
}
