import { Component } from '@angular/core';
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
  styleUrls: ['./absence.component.css']
})
export class AbsenceComponent {
  form: FormGroup;
  absences$: Observable<Absence[]>;

  constructor(
    private fb: FormBuilder,
    private absenceService: AbsenceService
  ) {
    this.form = this.fb.group({
      day: ['', Validators.required]
    });
    this.absences$ = this.absenceService.getAbsences();
  }

  save(): void {
    if (this.form.valid) {
      const newAbsence = {
        id: 0, // ID zostanie przypisane w serwisie
        day: this.form.value.day
      };
      this.absenceService.addAbsence(newAbsence);
      this.form.reset();
    }
  }
}
