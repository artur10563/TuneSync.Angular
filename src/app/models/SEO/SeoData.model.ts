export type SeoData = {
    title?: string;
    description?: string;
    ogImage?: OgImage;
    ogType?: OgType;
    ogUrl?: string;
    ogAudio?: string;
};


export interface OgImage {
    url?: string;
    alt: string;
}

export type OgType =
    | 'website'
    | 'article'
    | 'book'
    | 'profile'
    | 'payment.link'
    | 'music.song'
    | 'music.album'
    | 'music.playlist'
    | 'music.radio_station'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other';