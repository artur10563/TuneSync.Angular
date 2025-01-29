import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    //Do not intercept refresh requests as it will cause infinite loop
    if (req.url.includes('/user/refresh')) {
        return next(req);
    }

    //User is not authorized. Some actions allow it
    if (!accessToken || !refreshToken) {
        return next(req);
    }

    //Token is not valid - refresh it
    if (!authService.isTokenValid()) {
        return authService.refresh(refreshToken).pipe(
            switchMap((response) => {
                console.log("Token refreshed");
                authService.storeTokens(response);

                authService.updateAuthState();

                const clonedReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${response.accessToken}`,
                    },
                });
                return next(clonedReq);
            }),
            catchError((err: HttpErrorResponse) => {
                console.error("Token refresh failed", err);
                authService.logout();
                return next(req);
            })
        );
    }

    //Token is valid, return it
    const clonedReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return next(clonedReq);
};