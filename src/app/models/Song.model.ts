export interface Song {
    guid: string;
    title: string;
    artist: string;
    videoId: string;
    audioPath: string;
    audioSize: number;
    audioLength: string;
    createdAt: Date;
    isFavorite: boolean;
}