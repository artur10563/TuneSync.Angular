import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiError } from '../../models/shared.models';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info', duration = 3000) {
    this.notificationSubject.next({ message, type, duration });
  }


  handleError(err: any): void {
    if (Array.isArray(err.error)) {
      err.error.forEach((error: ApiError) => {
        this.show(error.description, 'error');
      });
    } else {
      this.show('An unexpected error occurred', 'error');
    }
  }
} 