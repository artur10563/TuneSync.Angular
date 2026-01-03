import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Playlist } from '../models/Playlist/Playlist.model';
import { Album } from '../models/Album/Album.mode';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PlaylistService } from '../services/playlist.service';
import { AlbumService } from '../services/album.service';

export const playlistResolver: ResolveFn<Playlist | Album | null> = (route: ActivatedRouteSnapshot) => {
    const type = route.data['type'] as 'playlist' | 'album';
    const guid = route.params['guid'];

    const playlistService = inject(PlaylistService);
    const albumService = inject(AlbumService);
    const router = inject(Router);

    if (!guid) return of(null);

    const data$ = type === 'playlist'
        ? playlistService.getPlaylistDetailsByGuid(guid)
        : albumService.getAlbumDetailtByGuid(guid);

    return data$.pipe(
        catchError(() => {
            router.navigate(['/']);
            return of(null);
        })
    );
};
