import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { ArtistComponent } from './components/artist/artist.component';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';

const routes: Routes = [
    { path: '', component: ArtistSearchComponent },
    { path: ':guid', component: ArtistComponent }
];

@NgModule({
    declarations: [
        ArtistComponent,
        ArtistSearchComponent
    ],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ArtistModule { }

