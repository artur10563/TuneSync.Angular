import { PlaylistSummary } from "../Playlist.model";
import { Song } from "../Song.model";
import { Artist } from "./Artist.model";

export interface ArtistSummary{
    artistInfo: Artist;
    playlists: PlaylistSummary[];
    songs: Song[];
}