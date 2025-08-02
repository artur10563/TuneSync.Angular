import { BaseModel } from "../BaseModel.model";
import { Song } from "../Song/Song.model";

export interface Playlist extends BaseModel {
    title: string;
    createdBy: string;
    createdByName: string;
    thumbnailUrl?: string;
    isFavorite: boolean;
    songCount: number;
    // songs: Song[];
}