import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NotificationService } from "./notification.service";
import { Router } from '@angular/router';

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

    constructor(private http: HttpClient, private notificationService: NotificationService, private router: Router) {
        this.isAuthenticatedSubject.next(this.isTokenValid());
    }

    private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    get isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.getValue();
    }

    private rolesSubject = new BehaviorSubject<string[]>([]);
    get roles$(): Observable<string[]> {
        return this.rolesSubject.asObservable();
    }

    get roles(): string[] {
        return this.rolesSubject.getValue();
    }
    set roles(roles: string[]) {
        this.rolesSubject.next(roles);
    }

    // This method will be called to check and update authentication state when the tokens are set
    updateAuthState(): void {
        const isAuthenticated = this.isTokenValid();
        this.isAuthenticatedSubject.next(isAuthenticated);
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
    }

    //returns guid of new user
    register(name: string, email: string, password: string): Observable<string> {
        return this.http.post<string>(`${this.baseUrl}/register`, { name, email, password });
    }

    refresh(refreshToken: string) {
        return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, { refreshToken });
    }

    public logout() {
        this.clearTokens();
        setTimeout(() => {
            this.router.navigate(["/auth"]);
        });
    }

    storeTokens(tokensInfo: LoginResponse) {
        localStorage.setItem("accessToken", tokensInfo.accessToken);
        localStorage.setItem("refreshToken", tokensInfo.refreshToken);
        localStorage.setItem("expiresAt", tokensInfo.expiresAt.toString());
        this.updateAuthState();
    }

    clearTokens() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresAt");
        this.isAuthenticatedSubject.next(false);
    }

    isTokenValid(): boolean {
        const expiryDate = parseInt(localStorage.getItem("expiresAt") ?? "0", 10);
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            this.clearTokens();
            return false;
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (expiryDate && currentTime >= (expiryDate - 180)) { // Refresh 180 seconds before expiration

            return false;
        }

        return true;
    }


    updateRoles(): Observable<any> {
        return this.http.get<string[]>(`${this.baseUrl}/roles`).pipe(
            tap((response) => {
                this.roles = response;
            }),
            catchError((err) => {
                console.error('Error fetching roles:', err);
                this.notificationService.handleError(err);
                return of();
            })
        );
    }

    refreshAndHandleTokens(refreshToken: string): Observable<any> {
        return this.refresh(refreshToken).pipe(
            tap((response) => {
                console.log('Token refreshed');
                this.storeTokens(response);
                this.updateAuthState();
            }),
            catchError((err) => {
                this.notificationService.handleError(err);
                this.logout();
                return of();
            })
        );
    }

}
