import { Component } from '@angular/core';
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
export class BasketHomeComponent {
  showPayment: boolean = false;

  constructor(private reservationService: ReservationService) {}

  get hasPendingReservations(): boolean {
    return this.reservationService.getPendingReservations().length > 0;
  }

  togglePayment(): void {
    this.showPayment = !this.showPayment;
  }

  onPaymentCompleted(): void {
    this.showPayment = false;
  }
}
