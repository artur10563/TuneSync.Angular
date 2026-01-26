import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { playlistResolver } from '../../resolvers/playlist.resolver';

const routes: Routes = [
    { 
        path: ':guid', 
        component: PlaylistComponent, 
        resolve: { playlist: playlistResolver } 
    }
];

@NgModule({
    declarations: [
        PlaylistComponent
    ],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class PlaylistModule { }

