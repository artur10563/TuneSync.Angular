import { Artist } from "./Artist/Artist.model";
import { BaseModel } from "./BaseModel.model";
import { Song } from "./Song.model";

export interface Playlist extends BaseModel {
    title: string;
    createdBy: string;
    createdByName: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songs: Song[];
}

export interface PlaylistSummary {
    guid: string;
    title: string;
    isFavorite: boolean;
    thumbnailUrl?: string;
    artist? : Artist;
}