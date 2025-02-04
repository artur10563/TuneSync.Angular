import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, of, Subject } from 'rxjs';
import { YoutubeSong } from '../models/Youtube/YoutubeSong.model';
import { Song } from '../models/Song/Song.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { ApiError } from '../models/shared.models';
import { AudioService } from './audio.service';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SongService {

    private baseUrl: string = environment.apiUrl + "/song";
    private searchUrl: string = environment.apiUrl + "/search";
    private baseFavUrl: string = environment.apiUrl + "/favorite/song";
    private baseYouTubeUrl: string = environment.apiUrl + "/youtube/song/";
    private videoBase: string = "https://www.youtube.com/watch?v=";

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
        private authService: AuthService
    ) { }

    private songsSubject = new Subject<Song[]>();
    songs$ = this.songsSubject.asObservable();

    private youtubeSongsSubject = new Subject<YoutubeSong[]>();
    youtubeSongs$ = this.youtubeSongsSubject.asObservable();


    //bug: if whole youtube url is pasted instead of only v=ID we will get not related trash videos
    searchYoutubeSongs(query: string): void {

        // if (!query || query.trim() === '') return;

        const encodedQuery = encodeURIComponent(query);
        const urlWithQuery = `${this.baseYouTubeUrl}${encodedQuery}`;

        this.http.get<YoutubeSong[]>(urlWithQuery).subscribe({
            next: (songs) => {
                this.youtubeSongsSubject.next(songs);
            },
            error: (err) => {
                this.notificationService.handleError(err);
                this.youtubeSongsSubject.next([]);
            }
        });

    }


    downloadFromYoutube(videoId: string): Promise<any> {

        const url = this.videoBase + videoId;
        const apiUrl = `${this.baseYouTubeUrl}`;

        return firstValueFrom(
            this.http.post<YoutubeSong>(`${apiUrl}${encodeURIComponent(url)}`, {
                headers: { 'Content-Type': 'text/plain' }
            }
            ))
            .then((response) => {
                this.notificationService.show('Song downloaded successfully!', 'success');
            })
            .catch((error) => {
                this.notificationService.handleError(error);
            });
    }


    //get all, add filtering later
    searchDbSongs(query: string = "", page: number = 1): Observable<{ items: Song[], pageInfo: { page: number, totalPages: number } }> {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `${this.searchUrl}/${encodedQuery}`;

        const params = new HttpParams().set('page', page.toString());

        return this.http.get<{ items: Song[], pageInfo: { page: number, totalPages: number } }>(apiUrl, { params }).pipe(
            map(response => {
                return response;
            })
        );
    }

    toggleFavorite(song: Song) {
        const apiUrl = `${this.baseFavUrl}/${song.guid}`;

        if (!this.authService.isAuthenticated) {
            this.notificationService.show("Log In to perform this action!", 'error');
            return;
        }

        return this.http.put<void>(apiUrl, null).subscribe({
            next: () => {
                song.isFavorite = !song.isFavorite
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    getFavoriteSongs(): Observable<Song[]> {
        if (!this.authService.isAuthenticated) {
            this.notificationService.show("Log In to perform this action!", 'error');
            return of([]);
        }
        return this.http.get<Song[]>(this.baseFavUrl);
    }
}
