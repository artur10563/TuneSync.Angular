import { Component, Output } from '@angular/core';
import { SongService } from '../../services/song-service.service';
import { EventEmitter } from '@angular/core';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Song } from '../../models/Song.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    constructor(private songService: SongService, private sanitizer: DomSanitizer) { }

    searchQuery: string = '';
    @Output() searchResults = new EventEmitter<YoutubeSong[]>();
    @Output() dbSearchResults = new EventEmitter<Song[]>();

    performSearch(event: Event) {
        event.preventDefault();
        this.songService.getData(this.searchQuery).subscribe({
            next: (data) => {
                this.searchResults.emit(data);
                console.table(data);
            },
            error: (err) => console.error('Error fetching YouTube songs', err)
        });
        setTimeout(() => {
            this.songService.getDbSongs(this.searchQuery).subscribe({
                next: (data) => {
                    this.dbSearchResults.emit(data);
                    console.table(data);
                },
                error: (err) => console.error('Error fetching DB songs', err)
            });
        }, 50);
    }
}