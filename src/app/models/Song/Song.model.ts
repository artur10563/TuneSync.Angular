import { Artist } from "../Artist/Artist.model";
import { BaseModel } from "../BaseModel.model";

export interface Song extends BaseModel {
    title: string;
    artist: Artist;
    source: string;
    sourceUrl: string;
    audioPath: string;
    audioSize: number;
    audioLength: string;
    isFavorite: boolean;
    thumbnailUrl?: string;
    album: string;
    albumGuid: string;
}