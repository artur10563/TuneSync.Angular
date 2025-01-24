import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Playlist, PlaylistSummary } from '../models/Playlist.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, map, Observable, of } from 'rxjs';
import { PlaylistResponse } from '../models/Responses/GetPlaylistByGuidResponse.model';
import { PageInfo } from '../models/shared.models';

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

    private playlistsSubject = new BehaviorSubject<PlaylistSummary[]>([]);
    playlists$ = this.playlistsSubject.asObservable();

    set playlists(playlists: PlaylistSummary[]) {
        this.playlistsSubject.next(playlists);
    }

    get playlists(): PlaylistSummary[] {
        return this.playlistsSubject.getValue();
    }

    getCurrentUserPlaylists(): Observable<PlaylistSummary[]> {
        if (!this.authService.isAuthenticated) return of([]);

        return this.http.get<PlaylistSummary[]>(this.baseUrl);
    }

    getPlaylistByGuid(guid: string, page: number = 1): Observable<{ playlist: Playlist, pageInfo: PageInfo }> {
        const params = new HttpParams().set('page', page.toString());
    
        return this.http
        .get<PlaylistResponse>(`${this.baseUrl}/${guid}`, { params })
        .pipe(
            map(response => {
                console.log(response); 
                
                return {
                    playlist: {
                        ...response.playlistDetails,  
                        songs: response.songs.items   
                    },
                    pageInfo: response.songs.pageInfo  
                };
            })
        );
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
    createPlaylist(playlistTitle: string) {
        this.http.post<string>(this.baseUrl, null, { params: { playlistTitle } }).subscribe({
            next: (playlistId: string) => {

                const newPlaylist: PlaylistSummary = {
                    guid: playlistId,
                    title: playlistTitle
                };

                this.playlists = [...this.playlists, newPlaylist];
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

    deleteSongFromPlaylist(playlistGuid: string, songGuid: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${playlistGuid}/songs/${songGuid}`);
    }
}
