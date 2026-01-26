import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs';
import { SafeBrowserService } from '../core/services/safe-browser.service';
import { AuthService } from '../core/services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const safeLocalStorage = inject(SafeBrowserService);

    const accessToken = safeLocalStorage.get('accessToken');
    const refreshToken = safeLocalStorage.get('refreshToken');

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
        return authService.refreshAndHandleTokens(refreshToken).pipe(
          switchMap((response) => {
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });
            return next(clonedReq);
          }),
          catchError((err) => {
            console.error('Token refresh failed in interceptor', err);
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