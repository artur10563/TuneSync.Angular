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
import { SearchComponent } from './components/search/search.component';
import { ArtistMergeComponent } from './components/admin-components/artist-merge/artist-merge.component';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';
import { playlistResolver } from './resolvers/playlist.resolver';
import { FailedSongsComponent } from './components/admin-components/failed-songs/failed-songs.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'search', component: SearchComponent },
            { path: "playlist/:guid", component: PlaylistComponent, data: { type: 'playlist' }, resolve: { playlist: playlistResolver } },
            { path: "album/:guid", component: PlaylistComponent, data: { type: 'album' }, resolve: { playlist: playlistResolver } },
            { path: "artist/:guid", component: ArtistComponent },
            { path: "artist", component: ArtistSearchComponent },
            {
                path: "favorite",
                component: FavoriteComponent,
                children: [
                    { path: '', redirectTo: 'song', pathMatch: 'full' },
                    { path: "song", component: FavoriteSongsComponent },
                    { path: "album", component: FavoriteAlbumsComponent, data: { isAlbumView: true } },
                    { path: "playlist", component: FavoriteAlbumsComponent, data: { isAlbumView: false } }
                ]
            },
            {
                //TODO: make separate layout for admin?
                //TODO: add auth/role guard for admin routes
                path: 'admin',
                children: [
                    {
                        path: 'artist',
                        children: [
                            {
                                path: 'merge', component: ArtistMergeComponent
                            }
                        ]
                    },
                    {
                        path: 'song',
                        children:[
                            {
                                path: 'failed', component: FailedSongsComponent
                            }
                        ]
                    }
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
