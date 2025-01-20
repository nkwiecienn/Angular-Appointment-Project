// // import { Injectable } from '@angular/core';
// // import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
// // import { Observable, throwError, catchError, switchMap } from 'rxjs';
// // import { AuthenticationService } from './services/authentication.service';

// // @Injectable()
// // export class AuthInterceptor implements HttpInterceptor {
// //   constructor(private authService: AuthenticationService) {}

// //   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// //     const accessToken = localStorage.getItem('accessToken');
// //     console.log('Intercepted request:', request.url);
// //     if (accessToken) {
// //       request = request.clone({
// //         setHeaders: {
// //           Authorization: `Bearer ${accessToken}`,
// //         },
// //       });
// //     }

// //     return next.handle(request).pipe(
// //       catchError((error: HttpErrorResponse) => {
// //         if (error.status === 401) {
// //           const refreshToken = localStorage.getItem('refreshToken');
// //           if (refreshToken) {
// //             return this.authService.refresh().pipe(
// //               switchMap((response: any) => {
// //                 localStorage.setItem('accessToken', response.accessToken);
// //                 localStorage.setItem('refreshToken', response.refreshToken);

// //                 request = request.clone({
// //                   setHeaders: {
// //                     Authorization: `Bearer ${response.accessToken}`,
// //                   },
// //                 });
// //                 return next.handle(request);
// //               })
// //             );
// //           }
// //         }

// //         return throwError(() => error);
// //       })
// //     );
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import { AuthenticationService } from './services/authentication.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthenticationService) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const accessToken = localStorage.getItem('accessToken');
//     console.log('Intercepted request:', request.url);
//     console.log('Access token from localStorage:', accessToken);
  
//     if (accessToken) {
//       request = this.addAuthorizationHeader(request, accessToken);
//       console.log('Authorization header added:', request.headers.get('Authorization'));
//     }
  
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           console.error('401 Unauthorized - attempting token refresh.');
//           const refreshToken = localStorage.getItem('refreshToken');
//           if (refreshToken) {
//             return this.authService.refresh().pipe(
//               switchMap((response: any) => {
//                 this.authService.saveTokens(response.accessToken, response.refreshToken, localStorage.getItem('email')!);
//                 request = this.addAuthorizationHeader(request, response.accessToken);
//                 return next.handle(request);
//               }),
//               catchError((refreshError) => {
//                 console.error('Token refresh failed:', refreshError);
//                 this.authService.logout();
//                 return throwError(() => refreshError);
//               })
//             );
//           } else {
//             this.authService.logout();
//           }
//         }
//         return throwError(() => error);
//       })
//     );
//   }
  

//   /**
//    * Dodaje nagłówek Authorization do żądania.
//    */
//   private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }
// }

import { HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const authService = inject(AuthenticationService);
  const accessToken = localStorage.getItem('accessToken');
  // console.log('Interceptor wywołany dla URL:', req.url);
  
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    // console.log('Dodano token do nagłówka:', req.headers.get('Authorization'));
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