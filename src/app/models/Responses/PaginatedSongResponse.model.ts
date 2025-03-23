import { PageInfo } from "../shared.models";
import { Song } from "../Song/Song.model";

export interface SongsResponse {
    items: Song[];
    pageInfo: PageInfo;
}