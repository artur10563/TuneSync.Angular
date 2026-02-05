import { ResolveFn } from '@angular/router';
import { SongService } from '../../../../services/song.service';
import { inject } from '@angular/core';
import { Song } from '../../../../models/Song/Song.model';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export const songResolver: ResolveFn<Song | null> = async (route) => {
    const songService = inject(SongService);
    const router = inject(Router);

    const guid = route.params['guid'];
    if (!guid) return null;

    try {
        const song = await firstValueFrom(songService.getByGuid(guid));
        return song;
    } catch (err) {
        router.navigate(['/']);
        return null;
    }
};