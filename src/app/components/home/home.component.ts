import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { SongService } from '../../services/song.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    youtubeSongs: YoutubeSong[] = [];
    private youtubeSongsSubscription!: Subscription;

    constructor(private songService: SongService) { }

    ngOnInit() {
        // Subscribe to youtubeSongs$ to get updates when new songs are emitted
        this.youtubeSongsSubscription = this.songService.youtubeSongs$.subscribe((songs) => {
            this.youtubeSongs = songs;
        });
    }

    ngOnDestroy() {
        // Clean up the subscription when the component is destroyed
        if (this.youtubeSongsSubscription) {
            this.youtubeSongsSubscription.unsubscribe();
        }
    }

}
