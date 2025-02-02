import { Component, Input } from '@angular/core';
import { Playlist, PlaylistSummary } from '../../models/Playlist.model';
import { ArtistSummary } from '../../models/Artist/ArtistSummary.mode';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.css'
})
export class PlaylistCardComponent {

    constructor(private playlistService: PlaylistService, private albumService: AlbumService){} //Need to separate album and playlist

    @Input() playlistSummary!: PlaylistSummary;
    @Input() artistSummary!: ArtistSummary;
    type!: 'playlist' | 'album';


     toggleFavorite(playlist: PlaylistSummary){
            if(this.type == "playlist"){
                this.playlistService.toggleFavorite(playlist);
            }
            else if(this.type = "album"){
                this.albumService.toggleFavorite(playlist);
            }
        }
}
