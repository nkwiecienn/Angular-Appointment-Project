import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketReservationsComponent } from '../basket-reservations/basket-reservations.component';
import { BasketPaymentComponent } from '../basket-payment/basket-payment.component';
import { ReservationService } from '../../services/reservation.service';
import { UserReservationsComponent } from '../user-reservations/user-reservations.component';

@Component({
  standalone: true,
  imports: [CommonModule, BasketReservationsComponent, BasketPaymentComponent, UserReservationsComponent],
  selector: 'basket-home',
  templateUrl: './basket-home.component.html',
  styleUrls: ['./basket-home.component.css']
})
export class BasketHomeComponent implements OnInit {
  showPayment: boolean = false;
  hasPendingReservations: boolean = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.loadReservations();
    this.reservationService.getPendingReservations().subscribe(pendingReservations => {
      this.hasPendingReservations = pendingReservations.length > 0;
    });

    this.reservationService.loadUsersReservations();

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
    this.hasPendingReservations = false; 
    this.reservationService.loadReservations(); 
    this.reservationService.loadUsersReservations(); 
  }
}  
