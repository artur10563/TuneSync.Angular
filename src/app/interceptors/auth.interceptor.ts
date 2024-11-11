import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor called');
  const token = localStorage.getItem('token');
  
  console.log('Current token:', token);
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.replace(/"/g, '')}`
      }
    });
    console.log('Request URL:', req.url);
    console.log('Request headers:', clonedRequest.headers.get('Authorization'));
    return next(clonedRequest);
  }
  return next(req);
}; 