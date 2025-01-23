import { HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const authService = inject(AuthenticationService);
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Błąd 401 - próba odświeżenia tokenu');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          return authService.refresh().pipe(
            switchMap((response: any) => {
              authService.saveTokens(
                response.accessToken, 
                response.refreshToken, 
                localStorage.getItem('email')!
              );
              
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              
              return next(clonedReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};