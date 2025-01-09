import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { AvailabilityHomeComponent } from './availability/availability-home/availability-home.component';
import { AbsenceComponent } from './absence/absence.component'; // Import komponentu bez lazy loadingu

export const routes: Routes = [
  {
    path: 'availability',
    component: AvailabilityHomeComponent // Bez lazy loadingu
  },
  {
    path: 'absence',
    component: AbsenceComponent // Bez lazy loadingu
  },
  {
    path: 'calendar',
    component: CalendarViewComponent // Bez lazy loadingu
  },
  {
    path: '', redirectTo: 'calendar', pathMatch: 'full' // Domyślne przekierowanie na /calendar
  }
];
