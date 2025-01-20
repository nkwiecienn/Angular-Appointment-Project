// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';

// interface RegisterModel {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   role: string;
// }

// interface LoginModel {
//   email: string;
//   password: string;
// }

// interface RefreshTokenDTO {
//   email: string;
//   refreshToken: string;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthenticationService {
//   private apiUrl = 'https://localhost:7194/api/auth';

//   constructor(private http: HttpClient) {}

//   register(model: RegisterModel): Observable<any> {
//     return this.http.post(`${this.apiUrl}/register`, model);
//   }

//   login(model: LoginModel): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, model);
//   }

//   refresh(): Observable<any> {
//     const email = localStorage.getItem('email');
//     const refreshToken = localStorage.getItem('refreshToken');

//     if (!email || !refreshToken) {
//       throw new Error('Brak danych do odświeżenia tokena');
//     }

//     const refreshTokenDTO = { email, refreshToken };

//     return this.http.post(`${this.apiUrl}/refresh`, refreshTokenDTO).pipe(
//       map((response: any) => {
//         // Zapisz nowy accessToken i refreshToken
//         localStorage.setItem('accessToken', response.AccessToken);
//         localStorage.setItem('refreshToken', response.RefreshToken);
//         return response;
//       })
//     );
//   }

//   logout(): Observable<any> {
//     return this.http.post(`${this.apiUrl}/logout`, {});
//   }
// }

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface RegisterModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginModel {
  email: string;
  password: string;
}

interface RefreshTokenDTO {
  email: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl = 'https://localhost:7194/api/auth';

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: object) {}

  register(model: RegisterModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<any> {
    console.log('Wysyłanie żądania logowania dla:', model.email);
    return this.http.post(`${this.apiUrl}/login`, model).pipe(
      map((response: any) => {
        console.log('Otrzymana odpowiedź:', response);
        if (response.accessToken && response.refreshToken) {
          this.saveTokens(response.accessToken, response.refreshToken, model.email);
          this.saveUserInfo(response.role, response.userData.id, response.userData.firstName, response.userData.lastName);
        }
        return response;
      })
    );
  }

  refresh(): Observable<any> {
    const email = localStorage.getItem('email');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!email || !refreshToken) {
      throw new Error('Brak danych do odświeżenia tokena');
    }

    console.log('Refreshing tokens:', { email, refreshToken });

    const refreshTokenDTO: RefreshTokenDTO = { email, refreshToken };

    return this.http.post(`${this.apiUrl}/refresh`, refreshTokenDTO).pipe(
      map((response: any) => {
        this.saveTokens(response.accessToken, response.refreshToken, email);
        return response;
      })
    );
  }

  logout(): Observable<void> {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return this.http.post<void>(`${this.apiUrl}/logout`, {});
    }
    return new Observable<void>((observer) => {
      this.clearSession();
      observer.next();
      observer.complete();
    });
  }
  

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  private saveUserInfo(role: number, id: number, firstName: string, lastName: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('role', role.toString());
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
      } catch (error) {
        console.error('Błąd zapisu danych użytkownika:', error);
      }
    } else {
      console.warn('localStorage jest niedostępny w tym środowisku.');
    }
  }

  public saveTokens(accessToken: string, refreshToken: string, email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('email', email);
        console.log('Tokeny zapisane w localStorage.');
        console.log('accessToken:', localStorage.getItem('accessToken'));
        console.log('refreshToken:', localStorage.getItem('refreshToken'));
      } catch (error) {
        console.error('Błąd zapisu do localStorage:', error);
      }
    } else {
      console.warn('localStorage jest niedostępny w tym środowisku.');
    }
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}
