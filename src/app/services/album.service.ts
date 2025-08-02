import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Album } from '../models/Album/Album.mode';
import { AlbumSummary } from '../models/Album/AlbumSummary.model';
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';
import { Song } from '../models/Song/Song.model';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    constructor(private http: HttpClient, private authService: AuthService, private notificationService: NotificationService) { }

    private readonly endpoints = {
        albumBase: `${environment.apiUrl}/album`,
        favoriteBase: `${environment.apiUrl}/favorite/album`,
        adminBase: `${environment.apiUrl}/admin/utils/album`,

        album: (guid: string) => `${this.endpoints.albumBase}/${guid}`,
        albumSongs: (guid: string) => `${this.endpoints.albumBase}/${guid}/songs`,
        albumRandom: () => `${this.endpoints.albumBase}/random`,

        favorite: () => this.endpoints.favoriteBase,
        favoriteByGuid: (guid: string) => `${this.endpoints.favoriteBase}/${guid}`,

        adminDelete: (guid: string) => `${this.endpoints.adminBase}/${guid}`,
    };


    getAlbumDetailtByGuid(guid: string): Observable<Album> {
        return this.http.get<Album>(this.endpoints.album(guid));
    }

    getAlbumSongsByGuid(guid: string, page: number = 1): Observable<PaginatedResponse<Song>> {
        const params = new HttpParams().set('page', page.toString());
        return this.http.get<PaginatedResponse<Song>>(this.endpoints.albumSongs(guid), { params });
    }

    toggleFavorite(playlist: AlbumSummary) {

        if (!this.authService.isAuthenticated) {
            this.notificationService.show("Log In to perform this action!", 'error');
            return;
        }

        return this.http.put<void>(this.endpoints.favoriteByGuid(playlist.guid), null).subscribe({
            next: () => {
                playlist.isFavorite = !playlist.isFavorite
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    getFavoriteAlbums(): Observable<AlbumSummary[]> {
        return this.http.get<AlbumSummary[]>(this.endpoints.favorite());
    }

    getRandomAlbums(): Observable<AlbumSummary[]> {
        return this.http.get<AlbumSummary[]>(this.endpoints.albumRandom());
    }

    deleteAlbum(guid: string): Observable<boolean> {
        return this.http.delete<boolean>(this.endpoints.adminDelete(guid));
    }
}
