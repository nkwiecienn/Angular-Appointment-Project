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
    this.reservationService.getReservations().subscribe(reservations => {
      this.pendingReservations = reservations.filter(res => !res.isReserved);
    });
  }

  removeReservation(reservationId: number): void {
    this.reservationService.removeReservation(reservationId);
  }
}
