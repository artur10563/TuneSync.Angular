import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeSong } from '../models/YoutubeSong.model';
import { Song } from '../models/Song.model';

@Injectable({
    providedIn: 'root'
})
export class SongService {

    private baseUrl: string = "https://localhost:7080/api/song/";
    private baseYouTubeUrl: string = "https://localhost:7080/api/song/youtube/";
    private videoBase: string = "https://www.youtube.com/watch?v=";

    constructor(private http: HttpClient) { }

    //bug: if whole youtube url is pasted instead of only v=ID we will get not related trash videos
    getData(query: string): Observable<YoutubeSong[]> {

        const encodedQuery = encodeURIComponent(query);
        const urlWithQuery = `${this.baseYouTubeUrl}${encodedQuery}`;
        return this.http.get<YoutubeSong[]>(urlWithQuery);
    }


    downloadFromYoutube(videoId: string): Observable<any> {

        const encodedUrl = encodeURIComponent(this.videoBase + videoId);
        const apiUrl = `${this.baseYouTubeUrl}${encodedUrl}`;
        return this.http.post<YoutubeSong>(apiUrl, {});
    }

    //get all, add filtering later
    getDbSongs(query: string = ""): Observable<Song[]> {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `${this.baseUrl}${encodedQuery}`;
        return this.http.get<Song[]>(apiUrl);
    }
}
