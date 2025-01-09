import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from './models/reservation';

@Component({
  standalone: true,
  selector: 'app-reservation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  @Input() date!: string;
  @Input() startTime!: string;
  @Input() validateSlots!: (length: number) => boolean; // Funkcja przekazywana z komponentu nadrzędnego
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  slotsAvailable = true;

  constructor(private fb: FormBuilder, private reservationService: ReservationService) {
    this.form = this.fb.group({
      length: [30, [Validators.required, Validators.min(30)]],
      type: ['konsultacja', Validators.required],
      patientName: ['', Validators.required],
      patientSurname: ['', Validators.required],
      gender: ['kobieta', Validators.required],
      age: [18, [Validators.required, Validators.min(16)]],
      details: ['']
    });

  }

  save(): void {
    if (this.form.valid) {
      const newReservation: Reservation = {
        id: 0, // Automatycznie ustawiane w serwisie
        date: this.date,
        startTime: this.startTime,
        endTime: this.calculateEndTime(this.startTime, this.form.value.length),
        length: this.form.value.length,
        type: this.form.value.type,
        patientName: this.form.value.patientName,
        patientSurname: this.form.value.patientSurname,
        gender: this.form.value.gender,
        age: this.form.value.age,
        details: this.form.value.details,
        isCanceled: false,
        isReserved: false
      };

      const length = this.form.get('length')?.value;

      // Sprawdzenie dostępności slotów
      if (this.validateSlots(length)) {
        this.reservationService.addReservation(newReservation);
        alert('Rezerwacja została zapisana.');
        this.form.reset();
        this.close.emit();
      } else {
        this.slotsAvailable = false; // Zmień stan flagi walidacji
        alert('Nie wszystkie wymagane sloty są dostępne.');
      }
    }
  }

  private calculateEndTime(startTime: string, length: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + length;
    const endHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const endMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  }

  cancel(): void {
    this.close.emit();
  }
}
