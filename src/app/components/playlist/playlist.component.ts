import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';
import { Playlist } from '../../models/Playlist.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    playlist: Playlist | null = null;
    currentPage: number = 1;
    totalPages: number = 1;

    constructor(
        private route: ActivatedRoute,
        private playlistService: PlaylistService,
        private albumService: AlbumService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            const type = this.route.snapshot.data['type'];

            if (guid) {
                this.fetchData(guid, type);
            }
        });
    }

    fetchData(guid: string, type: string): void {
        if (type === 'playlist') {
            this.playlistService.getPlaylistByGuid(guid, this.currentPage).subscribe(resp => {
                this.playlist = resp.playlist;
                this.totalPages = resp.pageInfo.totalPages;
            });
        } else if (type === 'album') {
            this.albumService.getAlbumByGuid(guid, this.currentPage).subscribe(resp => {
                this.playlist = resp.album;
                this.totalPages = resp.pageInfo.totalPages;
            });
        }
    }

    loadNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            const guid = this.route.snapshot.paramMap.get('guid');
            const type = this.route.snapshot.data['type'];

            if (guid) {
                if (type === 'playlist') {
                    this.playlistService.getPlaylistByGuid(guid, this.currentPage).subscribe(resp => {
                        this.playlist?.songs.push(...resp.playlist.songs);
                    });
                } else if (type === 'album') {
                    this.albumService.getAlbumByGuid(guid, this.currentPage).subscribe(resp => {
                        this.playlist?.songs.push(...resp.album.songs);
                    });
                }
            }
        }
    }
}
