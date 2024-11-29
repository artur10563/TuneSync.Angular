import { Component } from '@angular/core';


@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
    sidebarCollapsed = false;

    toggleSidebar(collapsed: boolean) {
        this.sidebarCollapsed = collapsed;
    }

}
