import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.errorMessage = 'Nie udało się zarejestrować. Spróbuj ponownie.';
        },
      });
    }
  }
}
