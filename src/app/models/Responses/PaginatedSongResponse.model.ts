import { Song } from "../Song/Song.model";
import { PageInfo } from "./PaginatedResponse.model";

export interface SongsResponse {
    items: Song[];
    pageInfo?: PageInfo;
}

export interface SongMetadata {
    TotalLength: string;
}