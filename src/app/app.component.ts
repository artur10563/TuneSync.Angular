import { Component, OnInit } from '@angular/core';
import { PlaylistService } from './services/playlist.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { SafeBrowserService } from './services/safe-storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private playlistService: PlaylistService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private safeLocalStorage : SafeBrowserService
    ) { }

    ngOnInit(): void {
        this.safeLocalStorage.title = "TyneSync";

        const refreshToken = this.safeLocalStorage.get('refreshToken');
        if (!this.authService.isTokenValid() && refreshToken) {
            this.authService.refreshAndHandleTokens(refreshToken).subscribe();
        }

        this.authService.isAuthenticated$.subscribe((isAuth) => {
            if (isAuth) {
                this.fetchPlaylists();

                this.authService.updateRoles().subscribe();
            }
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

