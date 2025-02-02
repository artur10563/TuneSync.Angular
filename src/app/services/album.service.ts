import { Injectable } from '@angular/core';
import { Playlist, PlaylistSummary } from '../models/Playlist.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageInfo } from '../models/shared.models';
import { PlaylistResponse } from '../models/Responses/GetPlaylistByGuidResponse.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    constructor(private http: HttpClient, private authService: AuthService, private notificationService: NotificationService) { }

    private baseUrl = environment.apiUrl + "/album";
    private baseFavUrl = environment.apiUrl + "/favorite/album";

    getAlbumByGuid(guid: string, page: number = 1): Observable<{ album: Playlist, pageInfo: PageInfo }> {
        const params = new HttpParams().set('page', page.toString());

        return this.http
            .get<PlaylistResponse>(`${this.baseUrl}/${guid}`, { params })
            .pipe(
                map(response => {
                    return {
                        album: {
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
}
