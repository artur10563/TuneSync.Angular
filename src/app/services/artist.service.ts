import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArtistSummary } from '../models/Artist/ArtistSummary.mode';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Artist } from '../models/Artist/Artist.model';
import { PaginatedResponse } from '../models/Responses/PaginatedResponse.model';



@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(private http: HttpClient) { }

    baseUrl = environment.apiUrl + "/artist";
    baseAdminUrl = environment.apiUrl + "/admin/utils/artist";

    getArtistSummary(artistGuid: string): Observable<ArtistSummary> {
        return this.http.get<ArtistSummary>(this.baseUrl + `/${artistGuid}`);
    }

    getArtistsPage(page: number = 1, pageSize: number = 25, orderBy: string = ArtistOrderColumns.CreatedAt, isDescending: boolean = false)
        : Observable<PaginatedResponse<Artist>> {

        const params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('orderBy', orderBy)
            .set('descending', isDescending);
        return this.http.get<PaginatedResponse<Artist>>(this.baseUrl, { params });
    }

    deleteArtist(artistGuid: string): Observable<boolean> {
        return this.http.delete<boolean>(this.baseAdminUrl + `/${artistGuid}`);
    }
}


export enum ArtistOrderColumns {
    CreatedAt = 'CreatedAt',
    ModifiedAt = 'ModifiedAt',
    Name = 'Name',
    DisplayName = 'DisplayName',
}