import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { FavoriteSongsComponent } from './components/favorite-songs/favorite-songs.component';
import { FavoriteAlbumsComponent } from './components/favorite-albums/favorite-albums.component';

const routes: Routes = [
    {
        path: '',
        component: FavoriteComponent,
        children: [
            { path: '', redirectTo: 'song', pathMatch: 'full' },
            { path: 'song', component: FavoriteSongsComponent },
            { path: 'album', component: FavoriteAlbumsComponent, data: { isAlbumView: true } },
            { path: 'playlist', component: FavoriteAlbumsComponent, data: { isAlbumView: false } }
        ]
    }
];

@NgModule({
    declarations: [
        FavoriteComponent,
        FavoriteSongsComponent,
        FavoriteAlbumsComponent
    ],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class FavoritesModule { }

