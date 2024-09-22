import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';

  performSearch(event: Event) {
    event.preventDefault(); 
    console.log('Searching for:', this.searchQuery);
  }
}
