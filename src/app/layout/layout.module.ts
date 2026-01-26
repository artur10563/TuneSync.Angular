import { NgModule } from '@angular/core';
import { UISharedModule } from '../shared/ui-shared.module';
import { CoreModule } from '../core/core.module';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [NavbarComponent, SidebarComponent, MainLayoutComponent],
    imports: [UISharedModule, CoreModule],
    exports: [NavbarComponent, SidebarComponent, MainLayoutComponent]
})
export class LayoutModule { }
