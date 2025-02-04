import { Artist } from "../Artist/Artist.model";

export interface AlbumSummary {
    guid: string;
    title: string;
    isFavorite: boolean;
    thumbnailUrl?: string;
    songCount: number;
    artist? : Artist;
}