import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../models/time-slot';
import { ReservationService } from '../../services/reservation.service';

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

  constructor(private reservationService: ReservationService) {}

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

    if (this.slot.isReserved && this.slot.reservationId) {
      if (this.reservationService.getReservationById(this.slot.reservationId)) {
        return 'reserved-' + this.reservationService.getReservationById(this.slot.reservationId)?.type;
      } else {
        return 'reserved-default';
      }
    }

    return 'free-slot';
  }

  getReservationDetails(): string {
    if (!this.slot.reservationId) {
      return 'Brak rezerwacji';
    }
  
    const reservation = this.reservationService.getReservationById(this.slot.reservationId);
    if (reservation) {
      return `
        Pacjent: ${reservation.patientName} ${reservation.patientSurname}<br>
        Typ: ${reservation.type}<br>
        Szczegóły: ${reservation.details || 'Brak'}
      `;
    }
  
    return 'Nie znaleziono szczegółów rezerwacji';
  }
}
