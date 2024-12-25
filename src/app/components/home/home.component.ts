import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/Song.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
    youtubeSongs: YoutubeSong[] = [];
    private youtubeSongsSubscription!: Subscription;
    private searchSongsSubscription!: Subscription;
    songs: Song[] = [];

    constructor(private songService: SongService,

    ) { }

    ngOnInit() {

        this.searchSongsSubscription = this.songService.songs$.subscribe((songs) => {
            this.songs = songs;
        });

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
        if (this.searchSongsSubscription) {
            this.searchSongsSubscription.unsubscribe();
        }
    }

}
