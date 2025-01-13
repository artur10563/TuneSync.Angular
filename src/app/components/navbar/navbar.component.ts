import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    constructor(
        private songService: SongService,
        private authService: AuthService,
        private notificationSerivce: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['query']) {
                this.searchQuery = params['query'];
                this.performSearch(new Event(''));
            }
        });
    }

    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated;
    }

    searchQuery: string = '';

    performSearch(event: Event) {
        event.preventDefault();
        this.router.navigate([''], { queryParams: { query: this.searchQuery } });

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