import { GenericSongSource } from "./song-source.interface";
import { SongService } from "../song.service";

export class FailedSongSource extends GenericSongSource<SongService> {

    constructor(songService: SongService) {
        super(
            songService,
            (page) => songService.getFailedSongs(page));
    }
}