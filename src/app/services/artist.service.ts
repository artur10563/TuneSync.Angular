import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ArtistSummary } from '../models/Artist/ArtistSummary.mode';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(private http: HttpClient) { }

    baseUrl = environment.apiUrl + "/artist";

    getArtistSummary(artistGuid: string): Observable<ArtistSummary> {
        return this.http.get<ArtistSummary>(this.baseUrl + `/${artistGuid}`);
    }
}
