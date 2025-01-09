import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AvailabilityService } from '../../services/availability.service';
import { Availability } from '../models/availability';

@Component({
  standalone: true,
  selector: 'app-availability-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './availability-home.component.html'
})
export class AvailabilityHomeComponent implements OnInit {
  availabilities: Availability[] = [];

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.availabilityService.loadAvailabilities().subscribe(avails => {
      this.availabilities = avails;
    });
  }
}
