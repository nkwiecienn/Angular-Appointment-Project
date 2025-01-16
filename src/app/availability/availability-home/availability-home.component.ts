import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeAvailabilityComponent } from '../range-availability/range-availability.component';
import { SingleDayAvailabilityComponent } from '../single-day-availability/single-day-availability.component';
import { AvailabilityService } from '../../services/availability.service';
import { Availability } from '../models/availability';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-availability-home',
  imports: [
    CommonModule,
    RangeAvailabilityComponent,
    SingleDayAvailabilityComponent,
  ],
  templateUrl: './availability-home.component.html',
  styleUrls: ['./availability-home.component.css'],
})
export class AvailabilityHomeComponent implements OnInit {
  availabilities$!: Observable<Availability[]>; // Modyfikator '!' mówi TypeScriptowi, że właściwość zostanie zainicjowana później

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  loadAvailabilities(): void {
    this.availabilities$ = this.availabilityService.getAvailabilities();
  }

  onAvailabilityAdded(): void {
    this.loadAvailabilities();
  }

  onAvailabilityDeleted(): void {
    this.loadAvailabilities();
  }
}

