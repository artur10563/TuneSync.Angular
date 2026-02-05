import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { ArtistMergeComponent } from './components/admin-components/artist-merge/artist-merge.component';
import { FailedSongsComponent } from './components/admin-components/failed-songs/failed-songs.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'artist',
                children: [
                    { path: 'merge', component: ArtistMergeComponent }
                ]
            },
            {
                path: 'song',
                children: [
                    { path: 'failed', component: FailedSongsComponent }
                ]
            }
        ]
    }
];

@NgModule({
    declarations: [
        ArtistMergeComponent,
        FailedSongsComponent
    ],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }

