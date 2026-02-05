import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseSharedModule } from '../../shared/base-shared.module';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
    { path: '', component: AuthComponent }
];

@NgModule({
    declarations: [AuthComponent],
    imports: [
        BaseSharedModule,
        RouterModule.forChild(routes)
    ]
})
export class AuthModule { }

