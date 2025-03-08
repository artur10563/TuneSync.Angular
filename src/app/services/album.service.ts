import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageInfo } from '../models/shared.models';
import { PlaylistResponse } from '../models/Responses/GetPlaylistByGuidResponse.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { Album } from '../models/Album/Album.mode';
import { AlbumSummary } from '../models/Album/AlbumSummary.model';
import { AlbumResponse } from '../models/Responses/GetAlbumByGuidResponse.model';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    constructor(private http: HttpClient, private authService: AuthService, private notificationService: NotificationService) { }

    private baseUrl = environment.apiUrl + "/album";
    private baseFavUrl = environment.apiUrl + "/favorite/album";

    getAlbumByGuid(guid: string, page: number = 1): Observable<{ album: Album, pageInfo: PageInfo }> {
        const params = new HttpParams().set('page', page.toString());

        return this.http
            .get<AlbumResponse>(`${this.baseUrl}/${guid}`, { params })
            .pipe(
                map(response => {
                    return {
                        album: {
                            ...response,
                            createdAt: new Date(response.createdAt),
                            modifiedAt: new Date(response.modifiedAt),
                            songs: response.songs.items,
                            artist: response.artist
                        },
                        pageInfo: response.songs.pageInfo
                    };
                })
            );
    }

    toggleFavorite(playlist: AlbumSummary) {
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

    getFavoriteAlbums() : Observable<AlbumSummary[]>{
        return this.http.get<AlbumSummary[]>(this.baseFavUrl);
    }

    getRandomAlbums() : Observable<AlbumSummary[]>{
        return this.http.get<AlbumSummary[]>(`${this.baseUrl}/random`);
    }
}
