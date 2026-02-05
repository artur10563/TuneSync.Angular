import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { carouselResponsiveOptions } from '../../../../shared/constants';
import { MixService } from '../../../../core/services/mix.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SeoService } from '../../../../core/services/seo.service';
import { AlbumSummary } from '../../../../models/Album/AlbumSummary.model';
import { Artist } from '../../../../models/Artist/Artist.model';
import { SeoData } from '../../../../models/SEO/SeoData.model';
import { AlbumService } from '../../../../services/album.service';
import { ArtistService } from '../../../../services/artist.service';
import { SongService } from '../../../../services/song.service';



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
        public readonly mixService: MixService,
        private readonly seoService: SeoService) {
        seoService.setSeoData(this.getHomePageSeo());
    }

    albums: AlbumSummary[] = [];
    artists: Artist[] = [];

    carouselConfig = carouselResponsiveOptions;

    ngOnInit(): void {
        this.albumService.getRandomAlbums().subscribe({
            next: (response) => {
                this.albums = response;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });

        this.artistSerivce.getArtistsPage(undefined, true, undefined, undefined, undefined, true).subscribe({
            next: (response) => {
                this.artists = response.items;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });

    }
    getHomePageSeo(): SeoData {
        return {
            title: 'Welcome to TuneSync',
            description:
                'Discover, download, mix your favorite music tracks, albums and artists.',
            ogType: 'website',
            ogUrl: environment.selfUrl,
            ogImage: {
                alt: 'Welcome to TuneSync',
            },
        };
    }
}
