import { Component } from '@angular/core';
import { SongService } from '../../services/song-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    constructor(private songService: SongService, private sanitizer: DomSanitizer, private router: Router) { }

    searchQuery: string = '';

    performSearch(event: Event) {
        event.preventDefault();

        this.songService.searchDbSongs(this.searchQuery);
    }

    navigateToLogin() {
        this.router.navigate(['/auth']);
    }
}