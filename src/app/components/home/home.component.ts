import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { AlbumService } from '../../services/album.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { NotificationService } from '../../services/notification.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(
        private songService: SongService,
        private albumService: AlbumService,
        private notificationService: NotificationService) { }

    albums: AlbumSummary[] = [];
    ngOnInit(): void {
        this.albumService.getRandomAlbums().subscribe({
            next: (response) => {
                this.albums = response;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

}
