import { Artist } from "../Artist/Artist.model";
import { Song } from "../Song/Song.model";
import { SongsResponse } from "./PaginatedSongResponse.model";

export interface PlaylistResponse {
    guid: string;
    title: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    modifiedAt: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songs: Song[],
    // songs: SongsResponse;
    artist: Artist;
    songCount: number;
}