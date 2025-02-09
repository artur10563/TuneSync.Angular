import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthComponent } from './components/auth/auth.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistComponent } from './components/artist/artist.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { FavoriteSongsComponent } from './components/favorite-songs/favorite-songs.component';
import { FavoriteAlbumsComponent } from './components/favorite-albums/favorite-albums.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: "playlist/:guid", component: PlaylistComponent, data: { type: 'playlist' } },
            { path: "album/:guid", component: PlaylistComponent, data: { type: 'album' } },
            { path: "artist/:guid", component: ArtistComponent },
            {
                path: "favorite",
                component: FavoriteComponent,
                children: [
                    { path: '', redirectTo: 'song', pathMatch: 'full' },
                    { path: "song", component: FavoriteSongsComponent },
                    { path: "album", component: FavoriteAlbumsComponent, data: { isAlbumView: true } },
                    { path: "playlist", component: FavoriteAlbumsComponent, data: { isAlbumView: false } }
                ]
            }
        ]
    },
    { path: 'auth', component: AuthComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
