import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song.model';
import { SongService } from '../../services/song-service.service';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html'
})
export class SongTableComponent implements OnInit {

    constructor(private songService: SongService) { }

    songs: Song[] = [];
    ngOnInit(): void {
        this.songService.songs$.subscribe((songs) => {
            this.songs = songs;
        });
    }

    onPlayClick(song: Song) {
        this.songService.currentSong = song;
    }
}