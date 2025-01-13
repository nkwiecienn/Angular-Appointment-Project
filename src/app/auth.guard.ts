import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('accessToken'); // Sprawdza, czy token istnieje
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Przekierowanie na logowanie, jeśli niezalogowany
    }
    return isLoggedIn;
  }
}
