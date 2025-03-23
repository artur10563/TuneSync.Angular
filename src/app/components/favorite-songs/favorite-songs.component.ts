import { Component } from '@angular/core';
import { Song } from '../../models/Song/Song.model';
import { NotificationService } from '../../services/notification.service';
import { SongService } from '../../services/song.service';

@Component({
    selector: 'app-favorite-songs',
    templateUrl: './favorite-songs.component.html',
    styleUrl: './favorite-songs.component.css'
})
export class FavoriteSongsComponent {
    songs: Song[] = [];

    constructor(private songService: SongService, private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.songService.getFavoriteSongs().subscribe({
            next: (songs) => {
                this.songs = songs;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }
}
