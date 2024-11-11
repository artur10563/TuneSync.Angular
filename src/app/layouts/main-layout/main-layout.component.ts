import { Component } from '@angular/core';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { Song } from '../../models/Song.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  youtubeSearchResults: YoutubeSong[] = [];
  dbSearchResults: Song[] = [];
  selectedSong: Song | null = null;
  sidebarCollapsed = false;

  toggleSidebar(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  handleSearchResults(results: YoutubeSong[]) {
    this.youtubeSearchResults = results;
  }

  handleDbSearchResults(results: Song[]) {
    this.dbSearchResults = results;
  }

  handleSongSelected(song: Song) {
    this.selectedSong = song;
  }
}
