import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-youtube-playlist',
    templateUrl: './youtube-playlist.component.html',
    styleUrl: './youtube-playlist.component.css'
})
export class YoutubePlaylistComponent implements OnChanges {


    @Input() playlistId: string = "";
    safeUrl: SafeResourceUrl = "";

    constructor(private sanitizer: DomSanitizer) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['playlistId'] && this.playlistId) {
            const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${this.playlistId}`;
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }
    }
}