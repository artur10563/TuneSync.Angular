import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeSong } from '../models/YoutubeSong.model';

@Injectable({
    providedIn: 'root'
})
export class SongService {

    private baseUrl: string = "https://localhost:7080/api/song/youtube/";
    private videoBase: string = "https://www.youtube.com/watch?v=";

    constructor(private http: HttpClient) { }

    //bug: if whole youtube url is pasted instead of only v=ID we will get not related trash videos
    getData(query: string): Observable<YoutubeSong[]> {

        const encodedQuery = encodeURIComponent(query);
        const urlWithQuery = `${this.baseUrl}${encodedQuery}`;
        return this.http.get<YoutubeSong[]>(urlWithQuery);
    }


    downloadFromYoutube(videoId: string): Observable<any> {

        const encodedUrl = encodeURIComponent(this.videoBase + videoId);
        const apiUrl = `${this.baseUrl}${encodedUrl}`;
        return this.http.post(apiUrl, {});
    }
}
