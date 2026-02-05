import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeBrowserService } from '../../../../core/services/safe-browser.service';
import { Song } from '../../../../models/Song/Song.model';
import { SeoService } from '../../../../core/services/seo.service';
import { SeoData } from '../../../../models/SEO/SeoData.model';
import { environment } from '../../../../../environments/environment';
import { AudioService } from '../../../../services/audio.service';

@Component({
    selector: 'app-song-redirect',
    template: ''
})
export class SongRedirectComponent implements OnInit {

    private song!: Song;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private browserService: SafeBrowserService,
        private seoService: SeoService,
        private service: AudioService
    ) { }

    ngOnInit(): void {
        this.song = this.route.snapshot.data['song'] as Song;
        if (!this.song) return;

        this.initSEO(this.song);
        this.handleBrowserOpen();
    }

    private initSEO(song: Song): void {
        const seoData: SeoData = {
            title: song.title,
            description: `Listen to ${song.title} by ${song.artist.name} on TuneSync.`,
            ogAudio: song.audioPath,
            ogType: 'music.song',
            ogUrl: `${environment.selfUrl}/song/${song.guid}`,
            ogImage: {
                url: song.thumbnailUrl || '',
                alt: `Thumbnail image for ${song.title} by ${song.artist.name}`
            }
        };
        this.seoService.setSeoData(seoData);
    }

    private handleBrowserOpen(): void {
        if (!this.browserService.isBrowserPlatform) return;

        this.service.currentSong = this.song;

        if (this.song.albumGuid) {
            this.router.navigate(['/album', this.song.albumGuid]);
            return;
        }

        this.router.navigate(['/artist', this.song.artist.guid]);
        return;
    }
}
