import { GenericSongSource } from "./song-source.interface";
import { SongService } from "../song.service";

export class SearchSongSource extends GenericSongSource<SongService> {

    constructor(songService: SongService, searchQuery: string) {
        super(
            songService,
            (page) => songService.searchDbSongs(searchQuery, page));
    }
}