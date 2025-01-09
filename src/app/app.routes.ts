import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';

export const routes: Routes = [
  {
    path: 'availability',
    // lazy loading => loadComponent
    loadComponent: () =>
      import('./availability/availability-home/availability-home.component')
        .then(m => m.AvailabilityHomeComponent)
  },
  {
    path: 'availability/single-day',
    loadComponent: () =>
      import('./availability/single-day-availability/single-day-availability.component')
        .then(m => m.SingleDayAvailabilityComponent)
  },
  {
    path: 'availability/range',
    loadComponent: () =>
      import('./availability/range-availability/range-availability.component')
        .then(m => m.RangeAvailabilityComponent)
  },
  { path: 'calendar', 
    loadComponent: () => 
      import('./calendar/calendar-view/calendar-view.component')
        .then(m => m.CalendarViewComponent) },
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarViewComponent }
];
