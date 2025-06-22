import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatMenu } from '@angular/material/menu';

@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrl: './image.component.css'
})
export class ImageComponent {
    @Input() imgSrc?: string | null;
    @Input() routerLink?: string | any[] | null = null;
    
    @ContentChild('overlayTemplate') overlayTemplate?: TemplateRef<any>;
}
