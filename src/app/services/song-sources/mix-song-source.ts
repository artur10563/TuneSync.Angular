import { map, Observable } from "rxjs";
import { Song } from "../../models/Song/Song.model";
import { BaseSongSource } from "./song-source.interface";
import { MixService } from "../mix.service";


export class MixSongSource extends BaseSongSource {

    private _shuffleSeed: string = this.generateShuffleSeed();

    get shuffleSeed(): string {
        return this._shuffleSeed;
    }


    constructor(private mixService: MixService) {
        super();
    }

    protected override fetchSongs(page: number): Observable<Song[]> {
        return this.mixService.getMixPage(page)
            .pipe(map(
                response => {
                    this.pageInfo = response.pageInfo
                    return response.items;
                }
            ));
    }

    private generateShuffleSeed(): string {
        return Date.now().toString();
    }
}