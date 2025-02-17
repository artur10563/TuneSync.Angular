import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appSheetOverlay]'
})
export class SheetOverlayDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}