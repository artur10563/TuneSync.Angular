import { Component, Input } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { MixService } from '../../services/mix.service';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.css']
})
export class PlaylistCardComponent {

    constructor(private playlistService: PlaylistService, private albumService: AlbumService, private mixService: MixService) {}

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

    getLink( ): any[] {
        return this.isAlbum(this.playlistSummary)
            ? ['/album', this.playlistSummary.guid]
            : ['/playlist', this.playlistSummary.guid];
    }

    addToMix(playlist: PlaylistSummary | AlbumSummary){
        this.isAlbum(playlist) 
        ? this.mixService.addAlbumToSelection(playlist as AlbumSummary) 
        : this.mixService.addPlaylistToSelection(playlist as PlaylistSummary);
    }
}
