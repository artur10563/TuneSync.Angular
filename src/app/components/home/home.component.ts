import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/Song.model';
import { ActivatedRoute } from '@angular/router';

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
    currentPage: number = 1;
    totalPages: number = 1;
    private queryParamsSubscription!: Subscription;
    searchQuery: string = '';

    constructor(private songService: SongService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
            if (params['query']) {
                this.searchQuery = params['query'];
                this.currentPage = 1; // Reset to first page
                this.songs = []; // Clear current songs
                this.fetchSongs();
            }
        });

        this.searchSongsSubscription = this.songService.songs$.subscribe((songs) => {
            this.songs = songs;
        });

        // Subscribe to youtubeSongs$ to get updates when new songs are emitted
        this.youtubeSongsSubscription = this.songService.youtubeSongs$.subscribe((songs) => {
            this.youtubeSongs = songs;
        });
    }

    fetchSongs() {
        this.songService.searchDbSongs(this.searchQuery, this.currentPage).subscribe(response => {
            this.songs = [...this.songs, ...response.items];
            this.totalPages = response.pageInfo.totalPages;
        });
    }

    loadNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchSongs();
        }
    }

    ngOnDestroy() {
        // Clean up the subscription when the component is destroyed
        if (this.youtubeSongsSubscription) {
            this.youtubeSongsSubscription.unsubscribe();
        }
        if (this.searchSongsSubscription) {
            this.searchSongsSubscription.unsubscribe();
        }
        if (this.queryParamsSubscription) {
            this.queryParamsSubscription.unsubscribe();
        }
    }
}
