import { Component, Input } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent {

    constructor(private playlistService: PlaylistService, private albumService: AlbumService) {}

    @Input() playlistSummary!: PlaylistSummary | AlbumSummary;

    toggleFavorite(playlist: PlaylistSummary | AlbumSummary) {
        if (this.isAlbum(playlist)) {
            this.albumService.toggleFavorite(playlist);
        } else {
            this.playlistService.toggleFavorite(playlist);
        }
    }

    isAlbum(playlist: PlaylistSummary | AlbumSummary): playlist is AlbumSummary {
        return (playlist as AlbumSummary).artist !== undefined;
    }
}
