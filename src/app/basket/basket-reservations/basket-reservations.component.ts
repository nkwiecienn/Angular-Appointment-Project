import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../reservation/models/reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'basket-reservations',
  templateUrl: './basket-reservations.component.html',
  styleUrls: ['./basket-reservations.component.css']
})
export class BasketReservationsComponent implements OnInit {
  pendingReservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadPendingReservations();
    this.reservationService.reservationsUpdated.subscribe(() => {
      this.loadPendingReservations();
    });
  }

  private loadPendingReservations(): void {
    this.reservationService.getPendingReservations().subscribe(reservations => {
      this.pendingReservations = reservations;
    });
  }

  removeReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(() => {
      this.loadPendingReservations();
    });
  }
}
