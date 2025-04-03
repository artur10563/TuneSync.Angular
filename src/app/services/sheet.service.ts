import { Injectable, ViewContainerRef, ComponentRef, Injector, EnvironmentInjector } from '@angular/core';
import { SheetComponent } from '../components/shared/sheet-overlay/sheet-overlay.component';
import { BehaviorSubject, timer } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class SheetService {
    private hostViewContainerRef?: ViewContainerRef;
    private sheetComponentRef?: ComponentRef<SheetComponent>;

    constructor(private injector: Injector, private environmentInjector: EnvironmentInjector) { }

    private isSheetOpenSubject = new BehaviorSubject<boolean>(false);
    isSheetOpen$ = this.isSheetOpenSubject.asObservable();

    get isOpen(): boolean {
        return this.isSheetOpenSubject.value;
    }

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


        this.isSheetOpenSubject.next(true);
    }

    closeSheet() {
        if (this.sheetComponentRef) {
            this.isSheetOpenSubject.next(false);

            timer(300).subscribe(() => this.destroySheet());
        }
    }

    private destroySheet() {
        if (this.sheetComponentRef) {
            this.sheetComponentRef.destroy();
            this.sheetComponentRef = undefined;
        }
    }
}
