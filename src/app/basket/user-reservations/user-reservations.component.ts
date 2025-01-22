import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../reservation/models/reservation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-reservations',
  imports: [CommonModule],
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.css'],
  standalone: true,
})
export class UserReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  error: string | null = null;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.reservationService.getUserReservations().subscribe({
        next: (data) => {
          this.reservations = data;
        },
        error: (err) => {
          console.error('Błąd podczas pobierania rezerwacji:', err);
          this.error = 'Nie udało się pobrać rezerwacji.';
        },
      });
    } else {
      this.error = 'Nie znaleziono zalogowanego użytkownika.';
    }
  }

  cancelReservation(reservationId: number): void {
    if (confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      this.reservationService.cancelReservation(reservationId).subscribe({
        next: () => {
          alert('Rezerwacja została anulowana.');
          // Aktualizuj status rezerwacji lokalnie, bez potrzeby ponownego ładowania
          const reservation = this.reservations.find(res => res.id === reservationId);
          if (reservation) {
            reservation.isCanceled = true;
            reservation.isReserved = false; // Dodatkowe zabezpieczenie
          }
        },
        error: (err) => {
          console.error('Błąd podczas anulowania rezerwacji:', err);
          alert('Nie udało się anulować rezerwacji.');
        },
      });
    }
  }
  
  
}
