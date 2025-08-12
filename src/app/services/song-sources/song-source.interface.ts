import { EMPTY, map, Observable, tap } from "rxjs";
import { PageInfo } from "../../models/shared.models";
import { Song } from "../../models/Song/Song.model";
import { PaginatedResponse } from "../../models/Responses/PaginatedResponse.model";

export interface SongSource {
    fetchThreshold: number; 

    loadInitial(): Observable<Song[]>
    loadNextPage(): Observable<Song[]>;
    hasNextPage(): boolean;

    // can be used to transfer already fetched songs from one source to another without re-fetching and while maintaining auto-fetching logic
    cachedSongs: Song[];
    pageInfo: PageInfo;
}

export abstract class BaseSongSource implements SongSource {
    fetchThreshold: number = 10;
    pageInfo: PageInfo = new PageInfo();
    cachedSongs: Song[] = [];

    protected lastFetchedPage: number = -Infinity;
    protected alreadyFetchedPage(page: number): boolean {
        return this.lastFetchedPage === page;
    }

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

export class GenericSongSource<TService> extends BaseSongSource {
    constructor(
        private service: TService,
        private fetchFunction: (page: number) => Observable<PaginatedResponse<Song>>) {
        super();
    }

    protected override fetchSongs(page: number): Observable<Song[]> {
        if (this.alreadyFetchedPage(page)) return EMPTY;
        this.lastFetchedPage = page;

        return this.fetchFunction(page).pipe(map(
            response => {
                this.pageInfo = response.pageInfo
                return response.items;
            }
        ));;
    }
}
