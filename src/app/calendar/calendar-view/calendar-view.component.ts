// src/app/calendar/calendar-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // daje *ngFor, *ngIf
import { CalendarService } from '../../services/calendar.service';
import { DaySchedule } from '../../models/day-schedule';
import { CalendarDayColumnComponent } from '../calendar-day-column/calendar-day-column.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CalendarDayColumnComponent, // wczytujemy używany komponent
  ],
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  weekDays: DaySchedule[] = [];
  currentWeekLabel = '';

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule(): void {
    this.calendarService.getSchedule().subscribe((data) => {
      this.currentWeekLabel = data.weekStart;
      this.weekDays = data.days;
    });
  }

  goToPreviousWeek() {
    // ...
  }

  goToNextWeek() {
    // ...
  }
}
