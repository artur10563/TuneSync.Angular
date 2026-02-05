import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { 
                path: '', 
                loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
            },
            { 
                path: 'search', 
                loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
            },
            { 
                path: 'playlist', 
                loadChildren: () => import('./features/playlist/playlist.module').then(m => m.PlaylistModule)
            },
            { 
                path: 'album', 
                loadChildren: () => import('./features/playlist/playlist.module').then(m => m.PlaylistModule)
            },
            { 
                path: 'artist', 
                loadChildren: () => import('./features/artist/artist.module').then(m => m.ArtistModule)
            },
            {
                path: 'favorite',
                loadChildren: () => import('./features/favorites/favorites.module').then(m => m.FavoritesModule)
            },
            {
                //TODO: make separate layout for admin?
                //TODO: add auth/role guard for admin routes
                path: 'admin',
                loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
            },
            {
                path: 'song',
                loadChildren: () => import('./features/song/song.module').then(m => m.SongModule)
            }
        ]
    },
    { 
        path: 'auth', 
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
