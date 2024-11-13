import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YoutubeSong } from '../models/YoutubeSong.model';
import { Song } from '../models/Song.model';
import { NotificationService } from './notification.service';

interface ApiError {
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongService {

    private baseUrl: string = "https://localhost:7080/api/song/";
    private baseYouTubeUrl: string = "https://localhost:7080/api/song/youtube/";
    private videoBase: string = "https://www.youtube.com/watch?v=";

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService
    ) { }

    //bug: if whole youtube url is pasted instead of only v=ID we will get not related trash videos
    getData(query: string): Observable<YoutubeSong[]> {

        const encodedQuery = encodeURIComponent(query);
        const urlWithQuery = `${this.baseYouTubeUrl}${encodedQuery}`;
        return this.http.get<YoutubeSong[]>(urlWithQuery);
    }


    downloadFromYoutube(videoId: string, title: string, author: string): Observable<any> {
        const encodedUrl = encodeURIComponent(this.videoBase + videoId);
        const apiUrl = `${this.baseYouTubeUrl}${encodedUrl}`;
        
        const payload = {
            songName: title,
            author: author,
            url: this.videoBase + videoId
        };
        
        return new Observable(observer => {
            this.http.post<YoutubeSong>(apiUrl, payload).subscribe({
                next: (response) => {
                    this.notificationService.show('Song downloaded successfully!', 'success');
                    observer.next(response);
                    observer.complete();
                },
                error: (error) => {
                    if (Array.isArray(error.error)) {
                        error.error.forEach((err: ApiError) => {
                            this.notificationService.show(err.description, 'error');
                        });
                    } else {
                        this.notificationService.show('An unexpected error occurred', 'error');
                    }
                    observer.error(error);
                }
            });
        });
    }

    //get all, add filtering later
    getDbSongs(query: string = ""): Observable<Song[]> {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `${this.baseUrl}${encodedQuery}`;
        return this.http.get<Song[]>(apiUrl);
    }
}
