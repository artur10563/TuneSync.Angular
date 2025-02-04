import { Artist } from "../Artist/Artist.model";
import { BaseModel } from "../BaseModel.model";
import { Song } from "../Song/Song.model";

export interface Album extends BaseModel {
    title: string;
    createdBy: string;
    createdByName: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songCount: number;
    songs: Song[];
    artist? : Artist;
}