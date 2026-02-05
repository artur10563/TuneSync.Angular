import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
    { path: '', component: SearchComponent }
];

@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class SearchModule { }

