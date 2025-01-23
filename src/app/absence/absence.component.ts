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

  loadAbsences(): void {
    this.absences$ = this.absenceService.getAbsences();
    this.absenceService.loadUserAbsences();
    this.userAbsences$ = this.absenceService.getUserAbsences();
  }

  save(): void {
    if (this.form.valid) {
      const newAbsence = {
        day: this.form.value.day,
        userId: Number(localStorage.getItem("userId")),
      };
      this.absenceService.addAbsence(newAbsence).subscribe(() => {
        this.loadAbsences();
        this.form.reset();
      });
    }
  }

  deleteAbsence(absenceId: number): void {
    this.absenceService.deleteAbsence(absenceId).subscribe(() => {
      this.loadAbsences();
    });
  }
}
