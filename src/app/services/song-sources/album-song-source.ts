import { Observable, map } from "rxjs";
import { PageInfo } from "../../models/shared.models";
import { Song } from "../../models/Song/Song.model";
import { AlbumService } from "../album.service";
import { BaseSongSource } from "./song-source.interface";
import { PlaylistService } from "../playlist.service";

export class AlbumSongSource extends BaseSongSource {

    private albumGuid: string;

    constructor(private albumService: AlbumService, albumGuid: string) {
        super();
        this.albumGuid = albumGuid;
    }

    protected fetchSongs(page: number): Observable<Song[]> {
        return this.albumService.getAlbumSongsByGuid(this.albumGuid, page).pipe(
            map(response => {
                this.pageInfo = response.pageInfo!;
                return response.items;
            })
        );
    }
}

export class PlaylistSongSource extends BaseSongSource {

    private playlistGuid: string;

    constructor(private playlistService: PlaylistService, playlistGuid: string) {
        super();
        this.playlistGuid = playlistGuid;
    }

    protected fetchSongs(page: number): Observable<Song[]> {
        return this.playlistService.getPlaylistSongsByGuid(this.playlistGuid, page).pipe(
            map(response => {
                this.pageInfo = response.pageInfo;
                return response.items;
            })
        );
    }

}