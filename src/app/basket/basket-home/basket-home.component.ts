import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketReservationsComponent } from '../basket-reservations/basket-reservations.component';
import { BasketPaymentComponent } from '../basket-payment/basket-payment.component';
import { ReservationService } from '../../services/reservation.service';

@Component({
  standalone: true,
  imports: [CommonModule, BasketReservationsComponent, BasketPaymentComponent],
  selector: 'basket-home',
  templateUrl: './basket-home.component.html',
  styleUrls: ['./basket-home.component.css']
})
export class BasketHomeComponent implements OnInit {
  showPayment: boolean = false;
  hasPendingReservations: boolean = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.loadReservations(); // Odśwież dane
    this.reservationService.getPendingReservations().subscribe(pendingReservations => {
      this.hasPendingReservations = pendingReservations.length > 0;
    });

    this.reservationService.reservationsUpdated.subscribe(() => {
      this.reservationService.getPendingReservations().subscribe(pendingReservations => {
        this.hasPendingReservations = pendingReservations.length > 0;
      });
    });
  }

  togglePayment(): void {
    this.showPayment = !this.showPayment;
  }

  onPaymentCompleted(): void {
    this.showPayment = false;
  }
}
