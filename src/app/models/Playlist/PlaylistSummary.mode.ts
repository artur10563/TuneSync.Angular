import { EntityWithTitle } from "../shared.models";

export interface PlaylistSummary extends EntityWithTitle {
    isFavorite: boolean;
    thumbnailUrl?: string;
    songCount: number;
}