import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification as CustomNotification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  activeNotifications: CustomNotification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notification => {
      this.activeNotifications.push(notification);
      setTimeout(() => {
        this.activeNotifications = this.activeNotifications.filter(n => n !== notification);
      }, notification.duration);
    });
  }

  getIcon(type: 'success' | 'error'): string {
    return type === 'success' ? 'bi-check-circle' : 'bi-x-circle';
  }
} 