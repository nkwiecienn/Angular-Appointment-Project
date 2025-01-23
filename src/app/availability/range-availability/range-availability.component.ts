import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AvailabilityService } from '../../services/availability.service';
import { Availability } from '../models/availability';

@Component({
  standalone: true,
  selector: 'app-range-availability',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './range-availability.component.html',
})
export class RangeAvailabilityComponent {
  @Output() availabilityAdded = new EventEmitter<void>();

  form: FormGroup;

  daysOfWeekOptions = [
    { label: 'Poniedziałek', value: 1 },
    { label: 'Wtorek', value: 2 },
    { label: 'Środa', value: 3 },
    { label: 'Czwartek', value: 4 },
    { label: 'Piątek', value: 5 },
    { label: 'Sobota', value: 6 },
    { label: 'Niedziela', value: 7 },
  ];

  constructor(private fb: FormBuilder, private availabilityService: AvailabilityService) {
    this.form = this.fb.group({
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      daysOfWeek: this.fb.array([]),
      timeRanges: this.fb.array([this.buildTimeRange()]),
    });
    this.initDaysOfWeekCheckboxes();
  }

  get timeRangesArray(): FormArray {
    return this.form.get('timeRanges') as FormArray;
  }

  buildTimeRange(): FormGroup {
    return this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  addTimeRange() {
    this.timeRangesArray.push(this.buildTimeRange());
  }

  removeTimeRange(index: number) {
    this.timeRangesArray.removeAt(index);
  }

  initDaysOfWeekCheckboxes() {
    const arr = this.form.get('daysOfWeek') as FormArray;
    this.daysOfWeekOptions.forEach(() => {
      arr.push(new FormControl(false));
    });
  }

  getDayOfWeekControl(index: number): FormControl {
    return (this.form.get('daysOfWeek') as FormArray).at(index) as FormControl;
  }
  

  save() {
    if (this.form.valid) {
      const selectedDays: number[] = [];
      const daysControl = this.form.get('daysOfWeek') as FormArray;
  
      daysControl.controls.forEach((ctrl, i) => {
        if (ctrl.value) {
          selectedDays.push(this.daysOfWeekOptions[i].value);
        }
      });
  
      const newAvailability: Availability = {
        id: 0,
        type: 'range',
        dateFrom: this.form.value.dateFrom,
        dateTo: this.form.value.dateTo,
        daysOfWeek: selectedDays,
        timeRanges: this.form.value.timeRanges,
        userId: Number(localStorage.getItem("userId")) || 0
      };
  
      this.availabilityService.addAvailability(newAvailability).subscribe({
        next: () => {
          alert('Zapisano dostępność (zakres dat).');
          this.availabilityAdded.emit();
          this.form.reset();
        },
        error: (err) => {
          console.error('Błąd podczas zapisywania dostępności:', err);
          alert('Wystąpił błąd podczas zapisywania dostępności.');
        },
      });
    }
  }
  
  
}
