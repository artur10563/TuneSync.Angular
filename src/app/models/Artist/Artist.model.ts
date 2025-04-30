import { EntityWithTitle } from "../shared.models";

export interface Artist extends EntityWithTitle {
    guid: string;
    name: string;
    displayName: string;
    channelUrl: string;
    thumbnailUrl?: string;
}



export interface ArtistWithCounts extends Artist {
    songCount: number;
    albumCount: number;
    childrenCount: number;
    parentName: string;
}