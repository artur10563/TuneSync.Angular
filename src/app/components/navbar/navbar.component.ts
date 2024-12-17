import { Component } from '@angular/core';
import { SongService } from '../../services/song.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    constructor(
        private songService: SongService,
        private authService: AuthService,
        private router: Router) { }

    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated;
    }

    searchQuery: string = '';

    performSearch(event: Event) {
        event.preventDefault();
        this.router.navigate(['']);

        this.songService.searchDbSongs(this.searchQuery);
        this.songService.searchYoutubeSongs(this.searchQuery);
    }

    navigateToLogin() {
        this.router.navigate(['/auth']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']); //wont clear prev content (for example, songs favorited by prev user.) TODO
    }
}