import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.replace(/"/g, '')}`
      }
    });
    console.warn('Request URL:', req.url);
    return next(clonedRequest);
  }
  return next(req);
}; 