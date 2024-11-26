import { BaseModel } from "./BaseModel.model";

export interface Song extends BaseModel {
    title: string;
    artist: string;
    source: string;
    sourceUrl: string;
    audioPath: string;
    audioSize: number;
    audioLength: string;
    isFavorite: boolean;
    thumbnailUrl?: string;
}