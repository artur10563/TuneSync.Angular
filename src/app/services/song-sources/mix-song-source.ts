import { GenericSongSource } from "./song-source.interface";
import { MixService } from "../mix.service";


export class MixSongSource extends GenericSongSource<MixService> {

    private _shuffleSeed: string = this.generateShuffleSeed();

    get shuffleSeed(): string {
        return this._shuffleSeed;
    }

    constructor(mixService: MixService) {
        super(
            mixService,
            (page) => mixService.getMixPage(page)
        );
    }

    private generateShuffleSeed(): string {
        return Date.now().toString();
    }
}