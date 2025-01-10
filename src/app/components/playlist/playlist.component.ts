import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../models/Playlist.model';
import { AlbumService } from '../../services/album.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    playlist: Playlist | null = null;

    constructor(
        private route: ActivatedRoute,
        private playlistService: PlaylistService,
        private albumService: AlbumService) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            const type = this.route.snapshot.data['type']; //Playlist or album. Both use same DTO for now. Might separate components in future

            if (guid) {

                if (type === 'playlist')
                    this.playlistService.getPlaylistByGuid(guid).subscribe(playlist => {
                        this.playlist = playlist;
                    });
                else if (type === 'album')
                    this.albumService.getAlbumByGuid(guid).subscribe(album => {
                        this.playlist = album;
                    });
            }
        });
    }
}
