import { AlbumSummary } from "../Album/AlbumSummary.model";
import { Song } from "../Song/Song.model";
import { Artist } from "./Artist.model";

export interface ArtistSummary{
    artistInfo: Artist;
    albums: AlbumSummary[];
    songs: Song[];
}