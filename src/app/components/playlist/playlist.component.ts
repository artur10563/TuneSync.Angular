import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../models/Playlist.model';
import { SongService } from '../../services/song.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    playlist: Playlist | null = null;

    constructor(
        private route: ActivatedRoute,
        private playlistService: PlaylistService) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            if (guid) {
                this.playlistService.getPlaylistByGuid(guid).subscribe(playlist => {
                    this.playlist = playlist;
                });
            }
        });
    }
}
