import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UISharedModule } from '../../shared/ui-shared.module';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent }
];

@NgModule({
    declarations: [HomeComponent],
    imports: [
        UISharedModule,
        RouterModule.forChild(routes)
    ]
})
export class HomeModule { }

