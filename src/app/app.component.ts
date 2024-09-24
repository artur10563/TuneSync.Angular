import { Component } from '@angular/core';
import { YoutubeSong } from './models/YoutubeSong.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    songs: YoutubeSong[] = [];
    sidebarWidth = '250px';

    onSidebarToggle(isCollapsed: boolean) {
        this.sidebarWidth = isCollapsed ? '80px' : '250px';
    }


    handleSearchResults(results: YoutubeSong[]) {
        this.songs = results;
    }

}

