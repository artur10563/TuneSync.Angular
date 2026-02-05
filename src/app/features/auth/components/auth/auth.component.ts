import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';


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
    ) { }

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
                next: (response) => {
                    this.authService.storeTokens(response)
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.notificationService.handleError(error);
                    this.isLoading = false;
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
                this.notificationService.handleError(error);
                this.isLoading = false;
            }
        });
    }
}
