import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../models/time-slot';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../reservation/models/reservation';
import { RoleService } from '../../services/role.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-calendar-slot-block',
  templateUrl: './calendar-slot-block.component.html',
  styleUrls: ['./calendar-slot-block.component.css'],
})
export class CalendarSlotBlockComponent implements OnInit {
  @Input() slot!: TimeSlot;

  showTooltip = false;
  reservationDetails: Reservation | null = null; // Szczegóły rezerwacji

  constructor(private reservationService: ReservationService, private roleService: RoleService) {}

  ngOnInit(): void {
    if (this.slot.isReserved && this.slot.reservationId) {
      this.fetchReservationDetails();
    }
  }

  private fetchReservationDetails(): void {
    if (this.slot.reservationId) {
      this.reservationService.getReservationById(this.slot.reservationId).subscribe({
        next: (reservation) => {
          this.reservationDetails = reservation;
        },
        error: (err) => {
          console.error(`Błąd pobierania rezerwacji ID ${this.slot.reservationId}:`, err);
        },
      });
    }
  }

  onMouseEnter() {
    if (this.slot.isReserved && this.slot.reservationId) {
      if (!this.reservationDetails?.isCanceled && this.roleService.isDoctor()) {
        this.showTooltip = true;
      }

      // Pobierz szczegóły rezerwacji, w tym UserName
      this.reservationService.getReservationById(this.slot.reservationId).subscribe({
        next: (reservation) => {
          this.reservationDetails = reservation;
        },
        error: () => {
          this.reservationDetails = null;
        },
      });
    }
  }

  onMouseLeave(): void {
    this.showTooltip = false;
  }

  getCssClass(): string {
    if(!this.reservationDetails?.isReserved) {
      return 'free-slot';
    }

    if (this.slot.isPast && this.slot.isReserved) {
      return 'past-block';
    }

    if (this.slot.isReserved && this.reservationDetails?.isCanceled) {
      return `canceled`;
    }

    if (this.slot.isReserved && this.reservationDetails?.isReserved) {
      return `reserved-${this.reservationDetails.type}`;
    }

    return this.slot.isReserved ? 'reserved-default' : 'free-slot';
  }

  getReservationTooltip(): string {
    if (!this.reservationDetails) {
      return 'Ładowanie szczegółów...';
    }

    return `
      <strong>Pacjent:</strong> ${this.reservationDetails.patientName} ${this.reservationDetails.patientSurname}<br>
      <strong>Typ:</strong> ${this.reservationDetails.type}<br>
      <strong>Szczegóły:</strong> ${this.reservationDetails.details || 'Brak'}
    `;
  }
}
