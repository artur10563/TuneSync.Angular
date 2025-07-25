import { map, Observable } from "rxjs";
import { Song } from "../../models/Song/Song.model";
import { BaseSongSource } from "./song-source.interface";
import { SongService } from "../song.service";

export class SearchSongSource extends BaseSongSource {

    constructor(private songService: SongService, private searchQuery: string) {
        super();
    }

    protected override fetchSongs(page: number): Observable<Song[]> {
        return this.songService.searchDbSongs(this.searchQuery, this.pageInfo.page).pipe(map(
            response => {
                this.pageInfo = response.pageInfo
                return response.items;
            }
        ));
    }
}