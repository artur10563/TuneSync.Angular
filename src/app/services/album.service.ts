import { Injectable } from '@angular/core';
import { Playlist } from '../models/Playlist.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageInfo } from '../models/shared.models';
import { PlaylistResponse } from '../models/Responses/GetPlaylistByGuidResponse.model';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    constructor(private http: HttpClient) { }

    private baseUrl = environment.apiUrl + "/album";

    getAlbumByGuid(guid: string, page: number = 1): Observable<{ album: Playlist, pageInfo: PageInfo }> {
            const params = new HttpParams().set('page', page.toString());
        
            return this.http
            .get<PlaylistResponse>(`${this.baseUrl}/${guid}`, { params })
            .pipe(
                map(response => {
                    return {
                        album: {
                            ...response.playlistDetails,  
                            songs: response.songs.items   
                        },
                        pageInfo: response.songs.pageInfo  
                    };
                })
            );
        }
}
