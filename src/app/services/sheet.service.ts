import { Injectable, ViewContainerRef, ComponentRef, Injector, EnvironmentInjector } from '@angular/core';
import { SheetComponent } from '../components/shared/sheet-overlay/sheet-overlay.component';


@Injectable({
    providedIn: 'root'
})
export class SheetService {
    private hostViewContainerRef?: ViewContainerRef;
    private sheetComponentRef?: ComponentRef<SheetComponent>;

    constructor(private injector: Injector, private environmentInjector: EnvironmentInjector) { }

    setRootViewContainerRef(vcr: ViewContainerRef) {
        this.hostViewContainerRef = vcr;
    }

    openSheet() {
        if (!this.hostViewContainerRef) {
            console.error('Host ViewContainerRef is not set.');
            return;
        }

        this.hostViewContainerRef.clear();

        this.sheetComponentRef = this.hostViewContainerRef.createComponent(SheetComponent, {
            index: 0,
            injector: this.injector,
            environmentInjector: this.environmentInjector
        });

        this.sheetComponentRef.instance.closed.subscribe(() => {
            this.closeSheet();
        });
    }

    closeSheet() {
        if (this.hostViewContainerRef) {
            this.hostViewContainerRef.clear();
            this.sheetComponentRef = undefined;
        }
    }
}
