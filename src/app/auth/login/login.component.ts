import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Wysyłanie żądania logowania');
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Odpowiedź z logowania:', response);
          this.router.navigate(['/calendar']);
        },
        error: (error) => {
          console.error('Błąd logowania:', error);
          this.errorMessage = 'Nie udało się zalogować. Sprawdź dane logowania.';
        },
      });     
    }
  }
}