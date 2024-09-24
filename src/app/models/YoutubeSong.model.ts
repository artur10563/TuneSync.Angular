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


// {
//     "id": "GPhOOe060ak",
//     "title": "Relaxing Music For Stress Relief, Anxiety and Depressive States • Heal Mind, Body and Soul",
//     "author": {
//       "id": "UC4L-dSrzbPoZcr1Av5GvwKw",
//       "title": "Open Heart Music - Helios 4K"
//     },
//     "description": "Relaxing Music For Stress Relief, Anxiety and Depressive States • Heal Mind, Body and Soul Music to sleep deeply and rest the ...",
//     "thumbnail": {
//       "height": 360,
//       "width": 480,
//       "url": "https://i.ytimg.com/vi/GPhOOe060ak/hqdefault_live.jpg"
//     }
//   },