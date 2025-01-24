import { Playlist } from "../Playlist.model";
import { PageInfo } from "../shared.models";
import { Song } from "../Song.model";


export interface SongsResponse {
    items: Song[];
    pageInfo: PageInfo;
}

export interface PlaylistResponse {
    playlistDetails: Playlist;
    songs: SongsResponse;
}