import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { Song } from '../models/Song/Song.model';
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';
import { AudioService } from './audio.service';
import { PageInfo } from '../models/shared.models';
import { BehaviorSubject } from 'rxjs';
import { AlbumSummary } from '../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../models/Playlist/PlaylistSummary.mode';
import { Artist } from '../models/Artist/Artist.model';


type MixItem = AlbumSummary | PlaylistSummary | Artist;
type MixItemType = 'album' | 'playlist' | 'artist';

// type TypedMixItem =
//     | (MixItem & { type: MixItemType });


class TypedMixItem {
    constructor(public readonly item: MixItem, public readonly type: MixItemType) { }

    get guid(): string {
        return this.item.guid;
    }

    get thumbnailUrl(): string {
        return this.item.thumbnailUrl || 'assets/images/noimage.svg';
    }

    get title(): string {
        return 'title' in this.item
            ? this.item.title
            : (this.item as Artist).name; // this is very bad
    }
}

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



    //albums + playlists max count is 50. min is 2
    public selectedItems: TypedMixItem[] = [];
    private wasChanged = false; //toggle on selectedItems change to prevent api spam

    private selectionCountSubject = new BehaviorSubject<number>(0);
    selectionCount$ = this.selectionCountSubject.asObservable();

    addItemToSelection(newItem: MixItem) {
        const exists = this.selectedItems.some((item) => item.guid === newItem.guid);
        if (exists) {
            this.notificationService.show(`${newItem.title} is already in mix!`, 'error');
            return;
        }

        const itemType =
            'sourceUrl' in newItem
                ? 'album'
                : 'channelUrl' in newItem
                    ? 'artist'
                    : 'playlist';
        const typedItem = new TypedMixItem(newItem, itemType);

        this.selectedItems.push(typedItem);
        this.updateSelectionCount();
    }


    removeItemFromSelection(itemOrGuids: MixItem | string[]): void {
        if (Array.isArray(itemOrGuids)) {
            this.selectedItems = this.selectedItems.filter(item => !itemOrGuids.includes(item.guid));
        } else {
            const index = this.selectedItems.findIndex(i => i.guid === itemOrGuids.guid);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
                this.updateSelectionCount();
                return;
            }
        }
        this.updateSelectionCount();
    }


    clearMix() {
        this.selectedItems = [];
        this.selectionCountSubject.next(0);
    }


    private updateSelectionCount() {
        this.selectionCountSubject.next(this.selectedItems.length);
        this.wasChanged = true;
    }

    startMix(): void {
        if (!this.validateSelection()) return;

        this.wasChanged = false; //lock untill next change
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
        const albumGuids = this.getCommaSeparatedGuids(this.selectedItems, 'album');
        const playlistGuids = this.getCommaSeparatedGuids(this.selectedItems, 'playlist');
        const artistGuids = this.getCommaSeparatedGuids(this.selectedItems, 'artist');

        return new HttpParams()
            .set('albumGuids', albumGuids)
            .set('playlistGuids', playlistGuids)
            .set('artistGuids', artistGuids)
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
        const albumGuids = this.getCommaSeparatedGuids(this.selectedItems, 'album');
        const playlistGuids = this.getCommaSeparatedGuids(this.selectedItems, 'playlist');
        const artistGuids = this.getCommaSeparatedGuids(this.selectedItems, 'artist');

        const httpParams = new HttpParams()
            .set('albumGuids', albumGuids)
            .set('playlistGuids', playlistGuids)
            .set('artistGuids', artistGuids)
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

    private getCommaSeparatedGuids(items: TypedMixItem[], type: MixItemType): string {

        const validGuids = items
            .filter(item => item.type === type)
            .map(item => item.guid).filter(guid => guid);

        return validGuids.length ? validGuids.join(',') : '';
    }

    private generateShuffleSeed(): string {
        return Date.now().toString();
    }

    private validateSelection(): boolean {
        const totalCount = this.selectedItems.length;
        const anyArtist = this.selectedItems.some(item => item.type === 'artist');
        if (anyArtist) return true; // single artist is enough for mix

        if (totalCount < 2) {
            this.notificationService.show(
                'Minimum of 2 albums/playlists required for mix',
                'error'
            );
            return false;
        }

        if (totalCount > 50) {
            this.notificationService.show(
                'You can select up to 50 albums/playlists',
                'error'
            );
            return false;
        }

        if (!this.wasChanged) {
            this.notificationService.show(
                'Mix in progress! You can start a new mix if the items have changed',
                'error'
            );
            return false;
        }

        return true;
    }

}
