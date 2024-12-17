import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-youtube-playlist',
    templateUrl: './youtube-playlist.component.html',
    styleUrls: ['./youtube-playlist.component.css']
})
export class YoutubePlaylistComponent implements OnInit {

    @Input() playlistId: string = "";
    safeUrl: SafeResourceUrl = "";

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        if (this.playlistId) {
            console.log("should display");
            const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${this.playlistId}`;
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }else{
            console.log("did not get playlistId");
        }
    }

    downloadPlaylist(){
        //Create download playlist job
        
        //Close modal

        //Hit job/status endpoint every 5 seconds, show notification unless job is completed(needs to be implemented as well)
        
        //Redirect to new playlist
    }

}
