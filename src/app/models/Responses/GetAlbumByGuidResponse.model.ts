import { Artist } from "../Artist/Artist.model";
import { SongsResponse } from "./PaginatedSongResponse.model";

export interface AlbumResponse {
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
    songCount: number;
    expectedCount: number;
    sourceUrl: string;
}
