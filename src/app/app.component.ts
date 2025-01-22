import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { RoleService } from './services/role.service';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'paw-project';

  constructor(
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthenticationService,
    public roleService: RoleService
  ) {}

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('accessToken')
    }
    return false;
  }

  get userEmail(): string | null {
    return localStorage.getItem('email');
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession(); // Wyczyść dane nawet jeśli żądanie zakończy się błędem
      },
    });
  }

  /**
   * Wyczyść dane sesji i przekieruj na stronę logowania
   */
  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}
