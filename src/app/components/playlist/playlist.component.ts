import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';
import { Playlist } from '../../models/Playlist/Playlist.model';
import { Album } from '../../models/Album/Album.mode';
import { ModalConfig } from '../../models/modal.model';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    playlist: Playlist | null = null;
    currentPage: number = 1;
    totalPages: number = 1;
    type = "";

    constructor(
        private route: ActivatedRoute,
        private playlistService: PlaylistService,
        private albumService: AlbumService,
        private modalService: ModalService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            this.type = this.route.snapshot.data['type'];

            if (guid) {
                this.fetchData(guid);
            }
        });
    }

    fetchData(guid: string): void {
        if (this.type === 'playlist') {
            this.playlistService.getPlaylistByGuid(guid, this.currentPage).subscribe(resp => {
                this.playlist = resp.playlist;
                this.totalPages = resp.pageInfo.totalPages;
            });
        } else if (this.type === 'album') {
            this.albumService.getAlbumByGuid(guid, this.currentPage).subscribe(resp => {
                this.playlist = resp.album;
                this.totalPages = resp.pageInfo.totalPages;
            });
        }
    }

    loadNextPage(): void {
        const guid = this.route.snapshot.paramMap.get('guid');
        if (guid == null || this.playlist == null) return;

        if (this.currentPage < this.totalPages) {
            this.currentPage++;

            if (this.isAlbum(this.playlist)) {
                this.albumService.getAlbumByGuid(guid, this.currentPage).subscribe(resp => {
                    this.playlist?.songs.push(...resp.album.songs);
                });
            } else {
                this.playlistService.getPlaylistByGuid(guid, this.currentPage).subscribe(resp => {
                    this.playlist?.songs.push(...resp.playlist.songs);
                });
            }
        }
    }

    toggleFavorite(playlist: Playlist | null) {
        if (playlist === null) {
            return;
        }

        if (this.isAlbum(playlist)) {
            this.albumService.toggleFavorite(playlist);
        } else {
            this.playlistService.toggleFavorite(playlist);
        }
    }

    isAlbum(playlist: Playlist | Album): playlist is Album {
        return (playlist as Album).artist !== undefined;
    }

    openDeletePlaylistModal(modalContent: TemplateRef<any>) {
        this.modalService.openModalFromTemplate(modalContent).then(
            (result) => {
                if (result === 'Yes') {
                    this.deletePlaylist();
                }
            },
            (reason) => {
            }
        );
    }

    deletePlaylist() {
        if (this.playlist) {
            this.playlistService.deletePlaylist(this.playlist.guid).subscribe({
                next: (result) => {
                    if (result) {
                        this.router.navigate(["/"]);
                        this.notificationService.show("Playlist deleted successfully!",'success');
                    }
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                }
            });
        }
    }
}
