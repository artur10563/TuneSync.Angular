import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { Song } from '../models/Song/Song.model';
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';
import { AudioService } from './audio.service';
import { EntityWithTitle, PageInfo } from '../models/shared.models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MixService {

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
        private audioService: AudioService) { }

    private readonly baseUrl = environment.apiUrl + "/song"; // will change in future
    private shuffleSeed = "";
    private fetchThreshold = 0.90; // 90% of songs

    private pageInfo: PageInfo = {
        page: 1,
        pageSize: 25,
        totalCount: 0,
        totalPages: 0
    }


    //albums + playlists max count is 10. min is 2
    private selectedAlbums: EntityWithTitle[] = [];
    private selectedPlaylists: EntityWithTitle[] = [];

    private selectionCountSubject = new BehaviorSubject<number>(0);
    selectionCount$ = this.selectionCountSubject.asObservable();

    addAlbumToSelection(album: EntityWithTitle) {
        const exists = this.selectedAlbums.some((item) => item.guid === album.guid);
        if(exists) {
            this.notificationService.show(`${album.title} is already in mix!`, 'error');
            return;
        }
        this.selectedAlbums.push(album);
        this.updateSelectionCount();
    }

    addPlaylistToSelection(playlist: EntityWithTitle) {
        const exists = this.selectedPlaylists.some((item) => item.guid === playlist.guid);
        if(exists) {
            this.notificationService.show(`${playlist.title} is already in mix!`, 'error');
            return;
        }
        this.selectedPlaylists.push(playlist);
        this.updateSelectionCount();
    }

    removeAlbumFromSelection(album: EntityWithTitle) {
        const index = this.selectedAlbums.findIndex(a => a.guid === album.guid);
        if (index !== -1) {
            this.selectedAlbums.splice(index, 1);
            this.updateSelectionCount();
        }
    }

    removePlaylistFromSelection(playlist: EntityWithTitle) {
        const index = this.selectedPlaylists.findIndex(p => p.guid === playlist.guid);
        if (index !== -1) {
            this.selectedPlaylists.splice(index, 1);
            this.updateSelectionCount();
        }
    }


    private updateSelectionCount() {
        const totalCount = this.selectedAlbums.length + this.selectedPlaylists.length;
        this.selectionCountSubject.next(totalCount);
    }

    startMix(): void {
        if (!this.validateSelection()) return;

        this.shuffleSeed = this.generateShuffleSeed();
        this.audioService.clearPlayedSongs();
        this.pageInfo = this.pageInfo = { page: 1, totalPages: 0, pageSize: 0, totalCount: 0 }; // Reset for a new mix

        this.fetchSongs(1, true);
    }

    private fetchSongs(page: number, isInitialFetch = false): void {
        const params = this.buildHttpParams(page);
        console.log("Fetching songs. Page:" + page);
        this.http.get<PaginatedResponse<Song>>(this.baseUrl, { params }).subscribe({
            next: (response) => {
                this.pageInfo = response.pageInfo;
                console.log(response);
                if (isInitialFetch) { //Override queue on initial fetch. Append after.
                    this.audioService.songQueue = response.items;
                    this.audioService.currentSong = response.items[0];
                } else {
                    this.audioService.songQueue = [
                        ...this.audioService.songQueue,
                        ...response.items,
                    ];
                }

                if (isInitialFetch) this.monitorMixProgress();
            },
            error: (err) => this.notificationService.handleError(err),
        });
    }

    private buildHttpParams(page: number): HttpParams {
        const albumGuids = this.getCommaSeparatedGuids(this.selectedAlbums);
        const playlistGuids = this.getCommaSeparatedGuids(this.selectedPlaylists);

        return new HttpParams()
            .set('albumGuids', albumGuids)
            .set('playlistGuids', playlistGuids)
            .set('page', page)
            .set('shuffleSeed', this.shuffleSeed);
    }

    private monitorMixProgress() {
        this.audioService.currentSong$.subscribe(() => {
            const playedSongsCount = this.audioService.playedSongGuids.length;
            const totalSongsCount = this.audioService.songQueue.length;
            console.log(`played - ${playedSongsCount} >= total - ${totalSongsCount} fetchThreshold=${totalSongsCount * this.fetchThreshold}`);

            const isEnd = this.audioService.nextSong == this.audioService.currentQueue[0] || this.audioService.nextSong === null;

            // Check if 90% of songs have been played
            if (((playedSongsCount >= totalSongsCount * this.fetchThreshold) || isEnd)
                && this.pageInfo.page < this.pageInfo.totalPages) {
                this.fetchNextPage();
            }
        });
    }

    private fetchNextPage() {
        console.log("Fetching songs. Page:" + this.pageInfo.page + 1);
        const albumGuids = this.getCommaSeparatedGuids(this.selectedAlbums);
        const playlistGuids = this.getCommaSeparatedGuids(this.selectedPlaylists);

        const httpParams = new HttpParams()
            .set('albumGuids', albumGuids)
            .set('playlistGuids', playlistGuids)
            .set('page', this.pageInfo.page + 1)
            .set('shuffleSeed', this.shuffleSeed);

        this.http.get<PaginatedResponse<Song>>(this.baseUrl, { params: httpParams }).subscribe({
            next: (response) => {
                console.log(response);

                this.pageInfo = response.pageInfo;
                this.audioService.songQueue = [...this.audioService.songQueue, ...response.items];
            },
            error: (err) => {
                this.notificationService.handleError(err);
            },
        });
    }

    private getCommaSeparatedGuids(items: EntityWithTitle[]): string {
        const validGuids = items.map(item => item.guid).filter(guid => guid);
        return validGuids.length ? validGuids.join(',') : '';
    }

    private generateShuffleSeed(): string {
        return Date.now().toString();
    }

    private validateSelection(): boolean {
        const totalCount = this.selectedAlbums.length + this.selectedPlaylists.length;

        if (totalCount < 2) {
            this.notificationService.show(
                'Minimum of 2 albums/playlists required for mix',
                'error'
            );
            return false;
        }

        if (totalCount > 10) {
            this.notificationService.show(
                'You can select up to 10 albums/playlists',
                'error'
            );
            return false;
        }

        return true;
    }

}
