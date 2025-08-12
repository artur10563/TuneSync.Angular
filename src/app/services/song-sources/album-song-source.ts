import { AlbumService } from "../album.service";
import { GenericSongSource } from "./song-source.interface";
import { PlaylistService } from "../playlist.service";

export class AlbumSongSource extends GenericSongSource<AlbumService> {

    constructor(albumService: AlbumService, albumGuid: string) {
        super(
            albumService,
            (page) => albumService.getAlbumSongsByGuid(albumGuid, page));
    }
}

export class PlaylistSongSource extends GenericSongSource<PlaylistService> {

    constructor(playlistService: PlaylistService, playlistGuid: string) {
        super(
            playlistService,
            (page) => playlistService.getPlaylistSongsByGuid(playlistGuid, page));
    }
}