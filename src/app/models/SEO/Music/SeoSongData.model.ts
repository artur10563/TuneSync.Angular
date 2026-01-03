
import { SeoProfileData } from "../SeoProfileData.model";
import { SeoAlbumData } from "./SeoAlbumData.model";

export type SeoSongData = {
    duration: number;
    album: SeoAlbumData;
    musician: SeoProfileData;
};
