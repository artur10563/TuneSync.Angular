import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Playlist, PlaylistSummary } from '../models/Playlist.model';
import { environment } from '../../environments/environment';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private notificationService: NotificationService
    ) { }

    private baseUrl = environment.apiUrl + "/playlist";
    private youtubeUrl = environment.apiUrl + "/youtube/playlist";

    getCurrentUserPlaylists(): Observable<PlaylistSummary[]> {
        if (!this.authService.isAuthenticated) return of([]);

        return this.http.get<PlaylistSummary[]>(this.baseUrl);
    }

    getPlaylistByGuid(guid: string): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.baseUrl}/${guid}`);
    }

    addSongToPlaylist(songGuid: string, playlistGuid: string) {
        this.http.post<string>(`${this.baseUrl}/${playlistGuid}/songs/${songGuid}`, null).subscribe({
            next: () => {
                this.notificationService.show('Song added successfully', "success");
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

    getYoutubePlaylist(channeld: string, songTitle: string): Observable<string> {
        return this.http.get<string>(`${this.youtubeUrl}/${channeld}/${songTitle}}`);
    }

    //returns jobId
    async downloadYoutubePlaylist(playlistId: string): Promise<string | null> {
        try {
            const response = await firstValueFrom(
                this.http.post<string>(`${this.youtubeUrl}/${playlistId}`, null)
            );
            return response;
        } catch (err) {
            this.notificationService.handleError(err);
            return null;
        }
    }

    //returns new playlist Guid
    createPlaylist(playlistTitle: string): Observable<string> {
        return this.http.post<string>(this.baseUrl, null, { params: { playlistTitle } });
    }
}
