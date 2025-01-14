import { Component, OnInit } from '@angular/core';
import { PlaylistService } from './services/playlist.service';
import { NotificationService } from './services/notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private playlistService: PlaylistService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.playlistService.getCurrentUserPlaylists().subscribe({
            next: (playlists) => {
                this.playlistService.playlists = playlists;
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }
}

