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
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';
import { Song } from '../models/Song/Song.model';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private notificationService: NotificationService
    ) { }

    public readonly endpoint = {
        base: `${environment.apiUrl}/playlist`,
        favoriteBase: `${environment.apiUrl}/favorite/playlist`,
        youtubeBase: `${environment.apiUrl}/youtube/playlist`,

        playlistDetails: (guid: string) => `${this.endpoint.base}/${guid}`,
        songs: (guid: string) => `${this.endpoint.base}/${guid}/songs`,
        addOrRemoveSongsToPlaylist: (playlistGuid: string, songGuid: string) =>
            `${this.endpoint.base}/${playlistGuid}/songs/${songGuid}`,
        favoriteByGuid: (guid: string) => `${this.endpoint.favoriteBase}/${guid}`,
        youtubeById: (id: string) => `${this.endpoint.youtubeBase}/${id}`,
        youtubeByChannelAndTitle: (channel: string, title: string) =>
            `${this.endpoint.youtubeBase}/${channel}/${title}`
    };


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

        return this.http.get<PlaylistSummary[]>(this.endpoint.base);
    }

    getPlaylistDetailsByGuid(guid: string): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.endpoint.playlistDetails(guid)}`);
    }

    getPlaylistSongsByGuid(guid: string, page: number = 1): Observable<PaginatedResponse<Song>> {
        const params = new HttpParams().set('page', page.toString());
        return this.http.get<PaginatedResponse<Song>>(this.endpoint.songs(guid), { params });
    }

    addSongToPlaylist(songGuid: string, playlistGuid: string) {
        this.http.post<string>(this.endpoint.addOrRemoveSongsToPlaylist(playlistGuid, songGuid), null).subscribe({
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

    getYoutubePlaylist(channelId: string, songTitle: string): Observable<string> {
        return this.http.get<string>(this.endpoint.youtubeByChannelAndTitle(channelId, songTitle));
    }

    //returns jobId
    async downloadYoutubePlaylist(playlistId: string): Promise<string | null> {
        try {
            const response = await firstValueFrom(
                this.http.post<string>(this.endpoint.youtubeById(playlistId), null)
            );
            return response;
        } catch (err) {
            this.notificationService.handleError(err);
            return null;
        }
    }

    //returns new playlist Guid
    createPlaylist(playlistTitle: string) {
        this.http.post<string>(this.endpoint.base, null, { params: { playlistTitle } }).subscribe({
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
        return this.http.delete<void>(this.endpoint.addOrRemoveSongsToPlaylist(playlistGuid, songGuid));
    }

    toggleFavorite(playlist: PlaylistSummary) {

        if (!this.authService.isAuthenticated) {
            this.notificationService.show("Log In to perform this action!", 'error');
            return;
        }

        return this.http.put<void>(this.endpoint.favoriteByGuid(playlist.guid), null).subscribe({
            next: () => {
                playlist.isFavorite = !playlist.isFavorite
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    getFavoritePlaylists(): Observable<PlaylistSummary[]> {
        return this.http.get<PlaylistSummary[]>(this.endpoint.favoriteBase);
    }

    deletePlaylist(guid: string): Observable<boolean> {
        return this.http.delete<void>(this.endpoint.playlistDetails(guid)).pipe(
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
