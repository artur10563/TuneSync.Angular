import { Component, Input } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { NotificationService } from '../../services/notification.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { PlaylistService } from '../../services/playlist.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-favorite-albums',
    templateUrl: './favorite-albums.component.html',
    styleUrl: './favorite-albums.component.css'
})
export class FavoriteAlbumsComponent {
    albums: AlbumSummary[] | PlaylistSummary[] = [];

    constructor(
        private albumService: AlbumService,
        private playlistService: PlaylistService,
        private notificationService: NotificationService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        let isAlbumView = this.route.snapshot.data['isAlbumView'];

        if (isAlbumView) {
            this.albumService.getFavoriteAlbums().subscribe({
                next: (albums) => {
                    this.albums = albums;
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                }
            });
        }
        else {

            this.playlistService.getFavoritePlaylists().subscribe({
                next: (playlists) => {
                    this.albums = playlists;
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                }
            });
        }
    }
}
