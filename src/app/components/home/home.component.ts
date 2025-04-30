import { Component, OnInit } from '@angular/core';
import { SongService } from '../../services/song.service';
import { AlbumService } from '../../services/album.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { NotificationService } from '../../services/notification.service';
import { Artist } from '../../models/Artist/Artist.model';
import { ArtistService } from '../../services/artist.service';
import { MixService } from '../../services/mix.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    constructor(
        private songService: SongService,
        private albumService: AlbumService,
        private artistSerivce: ArtistService,
        private notificationService: NotificationService,
        public readonly mixService: MixService) { }

    albums: AlbumSummary[] = [];
    artists: Artist[] = [];

    ngOnInit(): void {
        this.albumService.getRandomAlbums().subscribe({
            next: (response) => {
                this.albums = response;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });

        this.artistSerivce.getArtistsPage(undefined, undefined, undefined, undefined, true).subscribe({
            next: (response) => {
                this.artists = response.items;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });

    }

}
