import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../models/time-slot';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-calendar-slot-block',
  templateUrl: './calendar-slot-block.component.html',
  styleUrls: ['./calendar-slot-block.component.css']
})
export class CalendarSlotBlockComponent {
  @Input() slot!: TimeSlot;

  showTooltip = false;

  onMouseEnter() {
    if (this.slot.isReserved) {
      this.showTooltip = true;
    }
  }

  onMouseLeave() {
    this.showTooltip = false;
  }

  getCssClass(): string {
    if (this.slot.isPast && this.slot.isReserved) {
      return 'past-block';
    }

    if (this.slot.isReserved) {
      if (this.slot.type) {
        return 'reserved-' + this.slot.type.toLowerCase();
      } else {
        return 'reserved-default';
      }
    }

    return 'free-slot';
  }
}
