import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { PlaylistResponse } from '../models/Responses/GetPlaylistByGuidResponse.model';
import { PageInfo } from '../models/shared.models';
import { PlaylistSummary } from '../models/Playlist/PlaylistSummary.mode';
import { Playlist } from '../models/Playlist/Playlist.model';

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
    private baseFavUrl = environment.apiUrl + "/favorite/playlist";

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

                    return {
                        playlist: {
                            ...response,
                            createdAt: new Date(response.createdAt),
                            modifiedAt: new Date(response.modifiedAt),
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
                const playlist = this.playlists.find(pl => pl.guid === playlistGuid);
                if (playlist) playlist.songCount++; 
                
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
                    title: playlistTitle,
                    isFavorite: false,
                    songCount: 0
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

    toggleFavorite(playlist: PlaylistSummary) {
        const apiUrl = `${this.baseFavUrl}/${playlist.guid}`;

        if (!this.authService.isAuthenticated) {
            this.notificationService.show("Log In to perform this action!", 'error');
            return;
        }

        return this.http.put<void>(apiUrl, null).subscribe({
            next: () => {
                playlist.isFavorite = !playlist.isFavorite
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    getFavoritePlaylists(): Observable<PlaylistSummary[]> {
        return this.http.get<PlaylistSummary[]>(this.baseFavUrl);
    }

    deletePlaylist(guid: string): Observable<boolean> {
        const url = `${this.baseUrl}/${guid}`;
        return this.http.delete<void>(url).pipe(
            map(() => {
                const updatedPlaylists = this.playlists.filter(playlist => playlist.guid !== guid);
                this.playlists = updatedPlaylists;
                return true;
            }),
            catchError((err) => {
                this.notificationService.handleError(err);
                return of(false);
            })
        );
    }
}
