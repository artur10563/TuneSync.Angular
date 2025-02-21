import { Artist } from "../Artist/Artist.model";
import { EntityWithTitle } from "../shared.models";

export interface AlbumSummary extends EntityWithTitle {
    isFavorite: boolean;
    thumbnailUrl?: string;
    songCount: number;
    artist? : Artist;
    expectedCount: number;
    sourceUrl: string;
}