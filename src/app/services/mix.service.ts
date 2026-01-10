import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { Song } from '../models/Song/Song.model';
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';
import { AudioService } from './audio.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlbumSummary } from '../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../models/Playlist/PlaylistSummary.mode';
import { Artist, ArtistWithCounts } from '../models/Artist/Artist.model';
import { MixSongSource } from './song-sources/mix-song-source';
import { BaseSongSource, GenericSongSource } from './song-sources/song-source.interface';
import { SongMetadata } from '../models/Responses/PaginatedSongResponse.model';


type MixItem = AlbumSummary | PlaylistSummary | Artist | ArtistWithCounts;
type MixItemType = 'album' | 'playlist' | 'artist';

class TypedMixItem {
    constructor(public readonly item: MixItem, public readonly type: MixItemType) { }

    get guid(): string {
        return this.item.guid;
    }

    get thumbnailUrl(): string {
        return this.item.thumbnailUrl || 'assets/images/noimage.svg';
    }

    get title(): string {

        switch (this.type) {
            case 'album':
                return (this.item as AlbumSummary).title;
            case 'playlist':
                return (this.item as PlaylistSummary).title;
            case 'artist':
                return (this.item as Artist).displayName;
            default:
                return 'Unknown Item';
        }
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

    private readonly baseUrl = environment.apiUrl + "/song";


    //albums + playlists max count is 50. min is 2
    public selectedItems: TypedMixItem[] = [];
    private wasChanged = false; //toggle on selectedItems change to prevent api spam

    private selectionCountSubject = new BehaviorSubject<number>(0);
    selectionCount$ = this.selectionCountSubject.asObservable();

    private songSource: MixSongSource = new MixSongSource(this);

    addItemToSelection(newItem: MixItem) {
        const exists = this.selectedItems.some((item) => item.guid === newItem.guid);

        const itemType =
            'sourceUrl' in newItem
                ? 'album'
                : 'channelUrl' in newItem
                    ? 'artist'
                    : 'playlist';

        const typedItem = new TypedMixItem(newItem, itemType);

        if (exists) {
            this.notificationService.show(`${typedItem.title} is already in mix!`, 'error');
            return;
        }

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

        this.wasChanged = false;

        console.log('Old seed:', this.songSource.shuffleSeed);
        //Generate new shuffle seed for each mix so it wont be seen as a duplicate
        this.songSource = new MixSongSource(this);
        console.log('New seed:', this.songSource.shuffleSeed);

        this.audioService.setCurrentSongSource(this.songSource);
    }

    //Main logic used within MixSongSource
    getMixPage(page: number): Observable<PaginatedResponse<Song, SongMetadata>> {
        const params = this.buildHttpParams(page);
        return this.http.get<PaginatedResponse<Song, SongMetadata>>(this.baseUrl, { params });
    }

    artistMix(artist: Artist): void {
        this.clearMix();
        this.addItemToSelection(artist);
        this.startMix();
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
            .set('shuffleSeed', this.songSource.shuffleSeed);
    }


    private getCommaSeparatedGuids(items: TypedMixItem[], type: MixItemType): string {

        const validGuids = items
            .filter(item => item.type === type)
            .map(item => item.guid).filter(guid => guid);

        return validGuids.length ? validGuids.join(',') : '';
    }

    private validateSelection(): boolean {
        const totalCount = this.selectedItems.length;
        const anyArtist = this.selectedItems.some(item => item.type === 'artist');


        if (!this.wasChanged) {
            this.notificationService.show(
                'Mix in progress! You can start a new mix if the items have changed',
                'error'
            );
            return false;
        }

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

        return true;
    }

}
