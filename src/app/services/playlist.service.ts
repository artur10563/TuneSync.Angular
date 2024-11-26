import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { Playlist, PlaylistSummary } from '../models/Playlist.model';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';

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

    getCurrentUserPlaylists(): Observable<PlaylistSummary[]> {
        if (!this.authService.isAuthenticated) return of([]);

        return this.http.get<PlaylistSummary[]>(this.baseUrl);
    }

    getPlaylistByGuid(guid: string): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.baseUrl}/${guid}`);
    }
}
