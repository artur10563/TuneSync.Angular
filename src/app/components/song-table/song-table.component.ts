import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Song } from '../../models/Song.model';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html'
})
export class SongTableComponent {

    @Input()
    songs: Song[] = [];

    @Output()
    playSong = new EventEmitter<Song>()

    @Input() dbResults: Song[] = [];
    @Output() songSelected = new EventEmitter<Song>();

    onPlayClick(song : Song){
        this.songSelected.emit(song)
    }
}