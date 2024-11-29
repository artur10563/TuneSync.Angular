import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { YoutubeSong } from '../models/YoutubeSong.model';
import { Song } from '../models/Song.model';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

interface ApiError {
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class SongService {

    private baseUrl: string = environment.apiUrl + "/song";
    private baseYouTubeUrl: string = this.baseUrl + "/youtube/";
    private videoBase: string = "https://www.youtube.com/watch?v=";

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService
    ) { }

    private songsSubject = new BehaviorSubject<Song[]>([]);
    songs$ = this.songsSubject.asObservable();

    private currentSongSubject = new BehaviorSubject<Song | null>(null);
    currentSong$ = this.currentSongSubject.asObservable();

    private youtubeSongsSubject = new Subject<YoutubeSong[]>();
    youtubeSongs$ = this.youtubeSongsSubject.asObservable();

    //#region Getters, Setters

    set songs(songs: Song[]) {
        this.songsSubject.next(songs);
    }

    get songs(): Song[] {
        return this.songsSubject.getValue();
    }

    set currentSong(song: Song) {
        this.currentSongSubject.next(song);
    }

    get currentSong(): Song | null {
        return this.currentSongSubject.getValue();
    }

    get nextSong(): Song | null {
        const songs = this.songs;
        const current = this.currentSong;
        if (!current) return null;
        const index = songs.findIndex((s) => s.guid === current.guid);
        return songs[index + 1] || null;
    }

    get previousSong(): Song | null {
        const songs = this.songs;
        const current = this.currentSong;
        if (!current) return null;
        const index = songs.findIndex((s) => s.guid === current.guid);
        return songs[index - 1] || null;
    }
    //#endregion

    //bug: if whole youtube url is pasted instead of only v=ID we will get not related trash videos
    searchYoutubeSongs(query: string): void {

        const encodedQuery = encodeURIComponent(query);
        const urlWithQuery = `${this.baseYouTubeUrl}${encodedQuery}`;

        this.http.get<YoutubeSong[]>(urlWithQuery).subscribe({
            next: (songs) => {
                this.youtubeSongsSubject.next(songs);
            },
            error: (err) => {
                this.notificationService.show(err.description, 'error');
                this.youtubeSongsSubject.next([]);
            }
        });

    }


    downloadFromYoutube(videoId: string, title: string, author: string): Promise<any> {
        const encodedUrl = encodeURIComponent(this.videoBase + videoId);
        const apiUrl = `${this.baseYouTubeUrl}${encodedUrl}`;

        const payload = {
            songName: title,
            author: author,
            url: this.videoBase + videoId
        };

        return firstValueFrom(this.http.post<YoutubeSong>(apiUrl, payload))
            .then((response) => {
                this.notificationService.show('Song downloaded successfully!', 'success');
            })
            .catch((error) => {
                if (Array.isArray(error.error)) {
                    error.error.forEach((err: ApiError) => {
                        this.notificationService.show(err.description, 'error');
                    });
                } else {
                    this.notificationService.show('An unexpected error occurred', 'error');
                }
                console.error('Error uploading audio:', error);
                throw error;
            });
    }


    //get all, add filtering later
    searchDbSongs(query: string = ""): void {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `${this.baseUrl}/${encodedQuery}`;

        this.http.get<Song[]>(apiUrl).subscribe({
            next: (data) => this.songs = data,
            error: (err) => {
                this.notificationService.show(err.description, 'error')
            }
        });
    }
}
