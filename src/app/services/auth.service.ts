import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BehaviorSubject, EMPTY, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NotificationService } from "./notification.service";

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // Unix timestamp in seconds
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl: string = environment.apiUrl + "/user";
    private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('accessToken'));
    private refreshTokenTimeout: any;

    constructor(private http: HttpClient, private notificationService: NotificationService) { }

    get token(): string | null {
        return this.tokenSubject.value;
    }

    get isAuthenticated(): boolean {
        return this.isTokenValid();
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
            .pipe(
                tap({
                    next: (response) => {
                        this.storeTokens(response);
                        this.scheduleTokenRefresh(response.expiresAt);
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
        this.clearTokens();
        this.tokenSubject.next(null);
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }

    private storeTokens(response: LoginResponse): void {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('expiresAt', response.expiresAt.toString());
        this.tokenSubject.next(response.accessToken);
    }

    private clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
    }

    private scheduleTokenRefresh(expiresAt: number): void {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const delay = (expiresAt - currentTime - 180) * 1000; // Refresh 3 minutes before expiry
        if (delay > 0) {
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), delay);
        }
    }

    public refreshToken(): Observable<LoginResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return EMPTY;
        }

        return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, { refreshToken })
            .pipe(
                tap({
                    next: (response) => {
                        this.storeTokens(response);
                        this.scheduleTokenRefresh(response.expiresAt);
                    },
                    error: (error) => {
                        this.notificationService.handleError(error);
                        this.logout();
                    }
                })
            );
    }

    public isTokenValid(): boolean {
        const expiresAt = parseInt(localStorage.getItem('expiresAt') || '0', 10);
        const currentTime = Math.floor(Date.now() / 1000);
        const margin = 180;
        return expiresAt > currentTime + margin;
    }
}
