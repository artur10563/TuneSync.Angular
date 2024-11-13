import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string | null = null;

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          try {
            const errorArray = JSON.parse(error.error);
            if (Array.isArray(errorArray) && errorArray.length > 0) {
              this.errorMessage = errorArray
                .map(err => err.description)
                .join(', ');
            } else {
              this.errorMessage = 'Failed to login';
            }
          } catch {
            this.errorMessage = 'Failed to login';
          }
          this.isLoading = false;
          if (error) {
            this.notificationService.show(
              `Authentication failed: ${error.error?.message || 'Unknown error'}`,
              'error'
            );
          }
        }
      });
  }

  private handleRegister() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.isLoading = false;
      return;
    }

    this.authService.register(
      this.registerForm.name,
      this.registerForm.email,
      this.registerForm.password
    ).subscribe({
      next: () => {
        this.isLoginMode = true;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Failed to register';
        this.isLoading = false;
        if (error) {
          this.notificationService.show(
            `Authentication failed: ${error.error?.message || 'Unknown error'}`,
            'error'
          );
        }
      }
    });
  }
}
