import { Component, OnInit } from '@angular/core';
import { PlaylistService } from './services/playlist.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private playlistService: PlaylistService,
        private notificationService: NotificationService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.checkAndClearExpiredToken();
        this.fetchPlaylists();

        this.authService.onLogin().subscribe(() => {
            this.fetchPlaylists();
        });
    }

    private fetchPlaylists() {
        this.playlistService.getCurrentUserPlaylists().subscribe({
            next: (playlists) => {
                this.playlistService.playlists = playlists;
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }
}

