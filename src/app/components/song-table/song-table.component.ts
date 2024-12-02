import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song.model';
import { SongService } from '../../services/song.service';
import { AudioService } from '../../services/audio.service';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html',
    styleUrl: './song-table.component.css'
})
export class SongTableComponent implements OnInit {

    constructor(
        private songService: SongService,
        private audioService: AudioService
    ) { }

    songs: Song[] = [];
    currentSong: Song | null = null;
    isPlaying: boolean = false;

    ngOnInit(): void {
        this.songService.songs$.subscribe(songs => {
            this.songs = songs;
        });

        this.songService.currentSong$.subscribe((song) => {
            this.currentSong = song;
        });

        this.audioService.isPlaying$.subscribe((isPlaying) => {
            this.isPlaying = isPlaying;
        });
    }

    onPlayClick(song: Song): void {
        if (this.currentSong?.guid !== song.guid) {
            this.songService.currentSong = song;
        } else
            this.audioService.togglePlay();
    }
}