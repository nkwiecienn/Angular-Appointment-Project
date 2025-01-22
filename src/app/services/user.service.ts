import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7194/api/User';

  constructor(private http: HttpClient) {}

  // Pobierz listę użytkowników według roli
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/role/2`); // role = 2 dla lekarzy
  }
}
