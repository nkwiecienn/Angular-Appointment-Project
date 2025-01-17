import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'basket-payment',
  templateUrl: './basket-payment.component.html',
  styleUrls: ['./basket-payment.component.css']
})
export class BasketPaymentComponent {
  blikCode: string = '';
  @Output() paymentCompleted = new EventEmitter<void>();

  constructor(private reservationService: ReservationService) {}

  processPayment(): void {
    if (this.blikCode.length !== 6) {
      alert('Wprowadź poprawny kod BLIK (6 cyfr).');
      return;
    }

    this.reservationService.reserveAllPending().subscribe(() => {
      alert('Płatność zakończona.');
      this.paymentCompleted.emit();
    });
  }
}
