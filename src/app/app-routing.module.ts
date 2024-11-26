import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { SongTableComponent } from './components/song-table/song-table.component';
import { AuthComponent } from './components/auth/auth.component';
import { PlaylistComponent } from './components/playlist/playlist.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: SongTableComponent },
            { path: "playlist/:guid", component: PlaylistComponent }
        ]
    },
    { path: 'auth', component: AuthComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
