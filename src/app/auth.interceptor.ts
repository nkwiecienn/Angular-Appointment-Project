import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, switchMap } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return this.authService.refresh().pipe(
              switchMap((response: any) => {
                localStorage.setItem('accessToken', response.AccessToken);
                localStorage.setItem('refreshToken', response.RefreshToken);

                request = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.AccessToken}`,
                  },
                });
                return next.handle(request);
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}
