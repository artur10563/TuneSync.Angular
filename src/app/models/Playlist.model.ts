import { BaseModel } from "./BaseModel.model";
import { Song } from "./Song.model";

export interface Playlist extends BaseModel {
    title: string;
    createdBy: string;
    createdByName: string;
    thumbnailUrl?: string;
    songs: Song[];
}

export interface PlaylistSummary {
    guid: string;
    title: string;
    thumbnailUrl?: string;
}