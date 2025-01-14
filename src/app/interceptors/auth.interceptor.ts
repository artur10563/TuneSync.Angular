import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { switchMap, map } from "rxjs";
import { AuthService } from "../services/auth.service";

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = localStorage.getItem('accessToken');

    if (token) {
        if (authService.isTokenValid()) {
            const clonedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next(clonedRequest);
        } else {
            // Token is expired or about to expire, refresh it
            return authService.refreshToken().pipe(
                map((response) => {
                    return req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${response.accessToken}`
                        }
                    });
                }),
                switchMap((clonedRequest) => next(clonedRequest))
            );
        }
    }
    return next(req);
};
