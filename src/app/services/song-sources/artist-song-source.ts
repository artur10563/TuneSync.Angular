import { map, Observable } from "rxjs";
import { Song } from "../../models/Song/Song.model";
import { BaseSongSource } from "./song-source.interface";
import { ArtistService } from "../artist.service";
import { PageInfo } from "../../models/Responses/PaginatedResponse.model";

export class ArtistSongSource extends BaseSongSource {

    constructor(private artistService: ArtistService, private artistGuid: string) {
        super();
    }

    // Is it abandoned songs only?
    protected override fetchSongs(page: number): Observable<Song[]> {
        return this.artistService.getArtistSummary(this.artistGuid).pipe(
            map(response => {
                this.pageInfo = new PageInfo(); 
                return response.songs;
            })
        );
    }
}