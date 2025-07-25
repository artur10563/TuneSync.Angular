import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { SongService } from '../../services/song.service';
import { FavoriteSongSource } from '../../services/song-sources/favorite-song-source';
import { SongSource } from '../../services/song-sources/song-source.interface';

@Component({
    selector: 'app-favorite-songs',
    templateUrl: './favorite-songs.component.html',
    styleUrl: './favorite-songs.component.css'
})
export class FavoriteSongsComponent {
    protected songSource!: SongSource;

    constructor(private songService: SongService, private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.songSource = new FavoriteSongSource(this.songService);
        this.songSource.loadInitial().subscribe();
    }
}
