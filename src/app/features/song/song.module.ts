import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongRedirectComponent } from './components/song-redirect/song-redirect.component';
import { songResolver } from './components/song-redirect/song.resolver';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: ':guid',
        component: SongRedirectComponent,
        resolve: { song: songResolver },
        runGuardsAndResolvers: 'paramsChange'
    }
];

@NgModule({
    declarations: [
        SongRedirectComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class SongModule { }
