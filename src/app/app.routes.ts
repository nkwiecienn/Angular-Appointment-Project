// // src/app/app.routes.ts
// import { Routes } from '@angular/router';

// // 1) Możesz wczytać komponent przez loadComponent (lazy):
// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'calendar',
//     pathMatch: 'full'
//   },
//   {
//     path: 'calendar',
//     loadComponent: () => import('./calendar/calendar-view/calendar-view.component')
//       .then(m => m.CalendarViewComponent)
//   },
//   // ewentualnie inne ścieżki
// ];

// 2) Lub wczytać bez lazy (zwykły import):
// { path: 'calendar', component: CalendarViewComponent }
import { Routes } from '@angular/router';
import { CalendarViewComponent } from './calendar/calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: 'calendar', component: CalendarViewComponent }
];
