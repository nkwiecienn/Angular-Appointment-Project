import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  register(model: RegisterModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, model);
  }

  login(model: LoginModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, model);
  }

  refresh(): Observable<any> {
    const email = localStorage.getItem('email');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!email || !refreshToken) {
      throw new Error('Brak danych do odświeżenia tokena');
    }

    const refreshTokenDTO = { email, refreshToken };

    return this.http.post(`${this.apiUrl}/refresh`, refreshTokenDTO).pipe(
      map((response: any) => {
        // Zapisz nowy accessToken i refreshToken
        localStorage.setItem('accessToken', response.AccessToken);
        localStorage.setItem('refreshToken', response.RefreshToken);
        return response;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
