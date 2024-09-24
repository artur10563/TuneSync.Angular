import { Component, Output } from '@angular/core';
import { SongService } from '../../services/song-service.service';
import { EventEmitter } from '@angular/core';
import { YoutubeSong } from '../../models/YoutubeSong.model';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    constructor(private songService: SongService) { }

    searchQuery: string = '';
    @Output() searchResults = new EventEmitter<YoutubeSong[]>();


    performSearch(event: Event) {
        event.preventDefault();

        this.songService.getData(this.searchQuery).subscribe({
            next: (data) => {
                this.searchResults.emit(data);
                console.log(data);
            },
            error: (err) => console.error('Error fetching songs', err)
        });
    }

}