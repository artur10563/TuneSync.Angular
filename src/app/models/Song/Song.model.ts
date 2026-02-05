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

export function extractSongId(sourceUrl: string): string | null {
  const match = sourceUrl.match(/v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}