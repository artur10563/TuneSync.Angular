import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PlaylistService } from '../services/playlist.service';
import { AlbumService } from '../services/album.service';
import { firstValueFrom } from 'rxjs';
import { Playlist } from '../models/Playlist/Playlist.model';
import { Album } from '../models/Album/Album.mode';

export const playlistResolver: ResolveFn<Playlist | Album | null> = async (route: ActivatedRouteSnapshot) => {
    // Determine type from parent route path
    let type: 'playlist' | 'album' = route.data['type'] as 'playlist' | 'album';
    
    // If type is not in data, check the parent route path
    if (!type && route.parent) {
        const parentPath = route.parent.url.map(segment => segment.path).join('/');
        type = parentPath === 'playlist' ? 'playlist' : 'album';
    }
    
    const guid = route.params['guid'];

    if (!guid) return null;

    const playlistService = inject(PlaylistService);
    const albumService = inject(AlbumService);
    const router = inject(Router);

    try {
        const data$ = type === 'playlist'
            ? playlistService.getPlaylistDetailsByGuid(guid)
            : albumService.getAlbumDetailtByGuid(guid);

        const data = await firstValueFrom(data$);

        return data;
    } catch {
        router.navigate(['/']);
        return null;
    }
};
