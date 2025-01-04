import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song.model';
import { SongService } from '../../services/song.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit {
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
