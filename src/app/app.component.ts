import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sidebarWidth = '250px'; 

  onSidebarToggle(isCollapsed: boolean) {
    this.sidebarWidth = isCollapsed ? '80px' : '250px';
  }
}

