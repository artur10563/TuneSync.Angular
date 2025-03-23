import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Song } from '../../models/Song/Song.model';
import { YoutubeSong } from '../../models/Youtube/YoutubeSong.model';
import { SongService } from '../../services/song.service';
import { Artist } from '../../models/Artist/Artist.model';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();

    youtubeSongs: YoutubeSong[] = [];
    songs: Song[] = [];
    artists: Artist[] = [];
    currentPage = 1;
    totalPages = 1;
    searchQuery = '';
    showYoutubeSearchButton = false;

    constructor(private songService: SongService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
            if (params['query'] && params['query'] !== this.searchQuery) {
                this.searchQuery = params['query'];
                this.fetchSongs(true);
            }
        });

        this.songService.youtubeSongs$.pipe(takeUntil(this.unsubscribe$)).subscribe((songs) => {
            this.youtubeSongs = songs;
        });
    }

    fetchSongs(isNewSearch = false) {
        if (isNewSearch) {
            this.songs = [];
            this.youtubeSongs = [];
            this.artists = [];
            this.currentPage = 1;
            this.showYoutubeSearchButton = true;
        }

        this.songService.searchDbSongs(this.searchQuery, this.currentPage).subscribe(response => {
            if (!response) {
                this.fetchYoutubeSongs();
                return;
            }

            this.songs = [...this.songs, ...response.items];
            this.totalPages = response.pageInfo.totalPages;
            this.artists = [
                ...new Map(this.songs.map(x => [x.artist.guid, x.artist])).values()
              ];

        });
    }

    fetchYoutubeSongs() {
        this.songService.searchYoutubeSongs(this.searchQuery);
        this.showYoutubeSearchButton = false;
    }

    loadNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchSongs();
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
