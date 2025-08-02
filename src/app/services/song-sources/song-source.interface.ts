import { Observable, tap } from "rxjs";
import { PageInfo } from "../../models/shared.models";
import { Song } from "../../models/Song/Song.model";

export interface SongSource {
    fetchThresholdPercent: number; // 0 to 1 

    loadInitial(): Observable<Song[]>
    loadNextPage(): Observable<Song[]>;
    hasNextPage(): boolean;

    // can be used to transfer already fetched songs from one source to another without re-fetching and while maintaining auto-fetching logic
    cachedSongs: Song[];
    pageInfo: PageInfo;
}

export abstract class BaseSongSource implements SongSource {
    fetchThresholdPercent: number = 0.7;
    pageInfo: PageInfo = new PageInfo();
    cachedSongs: Song[] = [];

    loadInitial(): Observable<Song[]> {
        return this.fetchSongs(this.pageInfo.page)
            .pipe(tap(songs => this.cachedSongs = songs));
    }
    loadNextPage(): Observable<Song[]> {
        return this.fetchSongs(this.pageInfo.page + 1)
            .pipe(tap(songs => this.cachedSongs.push(...songs)));
    }
    hasNextPage(): boolean {
        return this.pageInfo.page < this.pageInfo.totalPages;
    }

    protected abstract fetchSongs(page: number): Observable<Song[]>;

    constructor() { }
}