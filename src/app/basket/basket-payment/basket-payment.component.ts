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

  isProcessing: boolean = false;

  processPayment(): void {
    if (this.isProcessing) return; // Zapobiega wielokrotnemu uruchomieniu
    this.isProcessing = true;
  
    if (this.blikCode.length === 6) {
      this.reservationService.reserveAllPendingReservations().subscribe({
        next: () => {
          alert('Płatność zakończona sukcesem!');
          this.paymentCompleted.emit();
          this.isProcessing = false; // Resetuj flagę
        },
        error: () => {
          alert('Wystąpił błąd podczas przetwarzania płatności.');
          this.isProcessing = false; // Resetuj flagę w przypadku błędu
        },
      });
    } else {
      alert('Kod BLIK musi mieć 6 cyfr.');
      this.isProcessing = false;
    }
  }
  

}
