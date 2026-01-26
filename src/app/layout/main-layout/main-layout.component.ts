import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { SheetOverlayDirective } from "../../shared/directives/sheet-overlay.directive";
import { SheetService } from "../../services/sheet.service";

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements AfterViewInit {
    sidebarCollapsed = false;

    toggleSidebar(collapsed: boolean) {
        this.sidebarCollapsed = collapsed;
    }

    @ViewChild(SheetOverlayDirective, { static: true }) sheetHost!: SheetOverlayDirective;

    constructor(private sheetService: SheetService) { }

    ngAfterViewInit(): void {
        this.sheetService.setRootViewContainerRef(this.sheetHost.viewContainerRef);
    }
}
