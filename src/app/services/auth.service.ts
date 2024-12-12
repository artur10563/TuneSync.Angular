import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';


interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginErrorResponse {
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private baseUrl: string = environment.apiUrl + "/user";
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient, private notificationService : NotificationService) {}

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, { email, password }, { responseType: 'text' })
      .pipe(
        tap({
          next: (token) => {
            localStorage.setItem('token', token);
            this.tokenSubject.next(token);
          },
          error: (error) => {
            this.notificationService.handleError(error);
          }
        })
      );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
} 