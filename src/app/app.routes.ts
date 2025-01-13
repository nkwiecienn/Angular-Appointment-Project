import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';
import { AvailabilityHomeComponent } from './availability/availability-home/availability-home.component';
import { AbsenceComponent } from './absence/absence.component';
import { BasketHomeComponent } from './basket/basket-home/basket-home.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'availability',
    component: AvailabilityHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'absence',
    component: AbsenceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calendar',
    component: CalendarViewComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'basket',
    component: BasketHomeComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: '*', redirectTo: 'calendar', pathMatch: 'full' 
  }
];
