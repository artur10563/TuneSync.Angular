import { GenericSongSource } from "./song-source.interface";
import { SongService } from "../song.service";

export class FavoriteSongSource extends GenericSongSource<SongService> {

    constructor(songService: SongService) {
        super(
            songService,
            (page) => songService.getFavoriteSongs(page));
    }
}