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

  /**
   * Rejestracja użytkownika
   */
  register(model: RegisterModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model);
  }

  /**
   * Logowanie użytkownika
   */
  // login(model: LoginModel): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, model).pipe(
  //     map((response: any) => {
  //       const accessToken = response.accessToken; // Użyj poprawnych kluczy
  //       const refreshToken = response.refreshToken;
  //       console.log('Login response:', response);
  //       console.log('Saving tokens from login:', { accessToken: response.accessToken, refreshToken: response.refreshToken, email: model.email });
  //       this.saveTokens(accessToken, refreshToken, model.email);
  //       return response;
  //     })
  //   );
  // }
  login(model: LoginModel): Observable<any> {
    console.log('Wysyłanie żądania logowania dla:', model.email);
    return this.http.post(`${this.apiUrl}/login`, model).pipe(
      map((response: any) => {
        console.log('Otrzymana odpowiedź:', response);
        if (response.accessToken && response.refreshToken) {
          this.saveTokens(response.accessToken, response.refreshToken, model.email);
        }
        return response;
      })
    );
  }

  /**
   * Odświeżanie tokena
   */
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

  /**
   * Wylogowanie użytkownika
   */
  // logout(): void {
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (accessToken) {
  //     this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
  //       next: () => this.clearSession(),
  //       error: () => this.clearSession(),
  //     });
  //   } else {
  //     this.clearSession();
  //   }
  // }

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
  

  /**
   * Sprawdzenie, czy użytkownik jest zalogowany
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
  }

  /**
   * Zapisz tokeny w localStorage
   */
  // private saveTokens(accessToken: string, refreshToken: string, email: string): void {
  //   console.log('Saving tokens:', { accessToken, refreshToken, email });
  //   localStorage.setItem('accessToken', accessToken);
  //   localStorage.setItem('refreshToken', refreshToken);
  //   localStorage.setItem('email', email);
  // }

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

  /**
   * Wyczyść sesję i przekieruj użytkownika na stronę logowania
   */
  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}
