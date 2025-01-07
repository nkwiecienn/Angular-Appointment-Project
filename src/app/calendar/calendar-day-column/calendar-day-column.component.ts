import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DaySchedule } from '../../models/day-schedule';
import { CalendarSlotComponent } from '../calendar-slot/calendar-slot.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CalendarSlotComponent // wczytujemy slot
  ],
  selector: 'app-calendar-day-column',
  templateUrl: './calendar-day-column.component.html',
  styleUrls: ['./calendar-day-column.component.css']
})
export class CalendarDayColumnComponent {
  @Input() dayData!: DaySchedule;
}
