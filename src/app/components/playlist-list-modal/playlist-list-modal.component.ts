import { Component, Input } from '@angular/core';
import { PlaylistSummary } from '../../models/Playlist.model';
import { PlaylistService } from '../../services/playlist.service';

@Component({
    selector: 'app-playlist-list-modal',
    templateUrl: './playlist-list-modal.component.html',
    styleUrl: './playlist-list-modal.component.css'
})
export class PlaylistListModalComponent {
    @Input() playlists: PlaylistSummary[] = [];
    @Input() songGuid: string = '';

    constructor(private playlistService: PlaylistService) { }

    onPlaylistClick(playlistGuid: string) {
        this.playlistService.addSongToPlaylist(this.songGuid, playlistGuid);
    }
}
