import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../models/time-slot';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../reservation/models/reservation';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-calendar-slot-block',
  templateUrl: './calendar-slot-block.component.html',
  styleUrls: ['./calendar-slot-block.component.css'],
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
      let cssClass = 'reserved-default';
      this.reservationService.getReservationById(this.slot.reservationId).subscribe(reservation => {
        if (reservation) {
          cssClass = `reserved-${reservation.type}`;
        }
      });
      return cssClass;
    }

    return 'free-slot';
  }

  getReservationDetails(): string {
    if (!this.slot.reservationId) {
      return 'Brak rezerwacji';
    }

    let details = 'Nie znaleziono szczegółów rezerwacji';
    this.reservationService.getReservationById(this.slot.reservationId).subscribe(reservation => {
      if (reservation) {
        details = `
          <strong>Pacjent:</strong> ${reservation.patientName} ${reservation.patientSurname}<br>
          <strong>Typ:</strong> ${reservation.type}<br>
          <strong>Szczegóły:</strong> ${reservation.details || 'Brak'}
        `;
      }
    });
    return details;
  }
}
