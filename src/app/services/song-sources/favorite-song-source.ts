import { Observable } from "rxjs";
import { Song } from "../../models/Song/Song.model";
import { BaseSongSource } from "./song-source.interface";
import { SongService } from "../song.service";

export class FavoriteSongSource extends BaseSongSource {

    constructor(private songService: SongService) {
        super();

    }

    //TODO: Implement pagination after we add it in API
    protected override fetchSongs(page: number): Observable<Song[]> {
        return this.songService.getFavoriteSongs();
    }

}