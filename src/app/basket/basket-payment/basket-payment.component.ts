import { Component, DebugElement, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { Console } from 'console';

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
    if (this.blikCode.length === 6) {
      this.reservationService.reserveAllPendingReservations().subscribe({
        next: () => {
          this.paymentCompleted.emit();
        },
        error: (err) => {
          console.error('Błąd podczas płatności:', err);
          alert('Nie udało się przetworzyć płatności.');
        },
      });
    } else {
      alert('Kod BLIK musi mieć 6 cyfr.');
    }
  }
  
}
