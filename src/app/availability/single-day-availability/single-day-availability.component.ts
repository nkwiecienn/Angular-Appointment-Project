import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { AvailabilityService } from '../../services/availability.service';
import { Availability } from '../models/availability';

@Component({
  standalone: true,
  selector: 'app-single-day-availability',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './single-day-availability.component.html',
})
export class SingleDayAvailabilityComponent {
  @Output() availabilityAdded = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private availabilityService: AvailabilityService) {
    this.form = this.fb.group({
      day: ['', Validators.required],
      timeRanges: this.fb.array([this.buildTimeRange()]),
    });
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

  save() {
    if (this.form.valid) {
      const newAvailability: Availability = {
        id: 0,
        type: 'single-day',
        day: this.form.value.day,
        timeRanges: this.form.value.timeRanges,
        userId: Number(localStorage.getItem("userId")) || 0
      };
  
      this.availabilityService.addAvailability(newAvailability).subscribe(() => {
        alert('Zapisano dostępność (jednodniową).');
        this.availabilityAdded.emit(); 
      });
    }
  }  
}
