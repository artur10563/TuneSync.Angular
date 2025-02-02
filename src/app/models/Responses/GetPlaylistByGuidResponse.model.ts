import { Artist } from "../Artist/Artist.model";
import { Playlist } from "../Playlist.model";
import { PageInfo } from "../shared.models";
import { Song } from "../Song.model";


export interface SongsResponse {
    items: Song[];
    pageInfo: PageInfo;
}

export interface PlaylistResponse {
    guid: string;
    title: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    modifiedAt: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songs: SongsResponse;
    artist: Artist;
}