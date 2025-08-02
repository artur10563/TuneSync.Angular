import { Artist } from "../Artist/Artist.model";
import { BaseModel } from "../BaseModel.model";
import { Song } from "../Song/Song.model";

export interface Album extends BaseModel {
    expectedCount: number;
    title: string;
    createdBy: string;
    createdByName: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songCount: number;
    // songs: Song[];
    artist? : Artist;
    sourceUrl: string;
}

export function extractAlbumId(sourceUrl: string): string | null {
    const match = sourceUrl.match(/list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}