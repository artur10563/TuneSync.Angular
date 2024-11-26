export interface YoutubeSong{
    id: string;
    title: string;
    description:string;
    author: Author;
    thumbnail: Thumbnail;
}

export interface Author{
    id:string;
    title:string;
}

export interface Thumbnail{
    height: number;
    width: number;
    url: string;
}