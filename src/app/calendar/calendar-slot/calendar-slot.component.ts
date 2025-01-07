import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../../models/time-slot';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-calendar-slot',
  templateUrl: './calendar-slot.component.html',
  styleUrls: ['./calendar-slot.component.css']
})
export class CalendarSlotComponent {
  @Input() slotData!: TimeSlot;
}
