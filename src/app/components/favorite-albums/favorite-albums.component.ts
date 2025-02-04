import { Component } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { NotificationService } from '../../services/notification.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';

@Component({
    selector: 'app-favorite-albums',
    templateUrl: './favorite-albums.component.html',
    styleUrl: './favorite-albums.component.css'
})
export class FavoriteAlbumsComponent {
    albums: AlbumSummary[] = [];

    constructor(private albumService: AlbumService, private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.albumService.getFavoriteAlbums().subscribe({
            next: (albums) => {
                this.albums = albums;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }
}
