import { Injectable } from '@angular/core';
import { Playlist } from '../models/Playlist.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    constructor(private http: HttpClient) { }

    private baseUrl = environment.apiUrl + "/album";

    getAlbumByGuid(guid: string): Observable<Playlist> {
        return this.http.get<Playlist>(`${this.baseUrl}/${guid}`);
    }
}
