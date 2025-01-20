import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/auth.interceptor';
import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(),
//     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
//   ]
// }).catch(err => console.error(err));
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));