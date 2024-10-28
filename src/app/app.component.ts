import { Component } from '@angular/core';
import { YoutubeSong } from './models/YoutubeSong.model';
import { Song } from './models/Song.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    songs: YoutubeSong[] = [];
    dbSongs: Song[] = [];
    sidebarWidth = '250px';

    onSidebarToggle(isCollapsed: boolean) {
        this.sidebarWidth = isCollapsed ? '80px' : '250px';
    }



    handleSearchResults(youtubeResult: YoutubeSong[]) {
        this.songs = youtubeResult;
    }

    handleDbSearchResults(result: Song[]) {
        this.dbSongs = result;
    }
}

