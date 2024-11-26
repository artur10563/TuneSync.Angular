import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistSummary } from '../../models/Playlist.model';
import { PlaylistService } from '../../services/playlist.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    @Output() sidebarToggle = new EventEmitter<boolean>();
    isCollapsed = false;
    playlists: PlaylistSummary[] = [];

    constructor(private playlistService: PlaylistService) { }

    ngOnInit(): void {
        this.playlistService.getCurrentUserPlaylists().subscribe(playlists => {
            this.playlists = playlists;
        });
    }


    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
        this.sidebarToggle.emit(this.isCollapsed);
    }
}
