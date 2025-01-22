import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbsenceService } from '../services/absence.service';
import { Absence } from '../absence/models/absence';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-absence',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.css'],
})
export class AbsenceComponent implements OnInit {
  form: FormGroup;
  absences$: Observable<Absence[]>;
  userAbsences$: Observable<Absence[]>;

  constructor(private fb: FormBuilder, private absenceService: AbsenceService) {
    this.form = this.fb.group({
      day: ['', Validators.required],
    });
    this.absences$ = new Observable<Absence[]>();
    this.userAbsences$ = new Observable<Absence[]>();
  }

  ngOnInit(): void {
    this.loadAbsences();
  }

  // Pobierz wszystkie absencje
  loadAbsences(): void {
    this.absences$ = this.absenceService.getAbsences();
    this.absenceService.loadUserAbsences();
    this.userAbsences$ = this.absenceService.getUserAbsences();
  }

  // Zapisz nową absencję
  save(): void {
    if (this.form.valid) {
      const newAbsence = {
        day: this.form.value.day,
        userId: Number(localStorage.getItem("userId")), // ID użytkownika można dynamicznie pobierać z kontekstu (np. zalogowanego użytkownika)
      };
      this.absenceService.addAbsence(newAbsence).subscribe(() => {
        this.loadAbsences(); // Odśwież listę po dodaniu
        this.form.reset();
      });
    }
  }

  // Usuń absencję
  deleteAbsence(absenceId: number): void {
    this.absenceService.deleteAbsence(absenceId).subscribe(() => {
      this.loadAbsences(); // Odśwież listę po usunięciu
    });
  }
}
