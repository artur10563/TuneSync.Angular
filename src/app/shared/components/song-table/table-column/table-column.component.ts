import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-table-column',
    template: ''
})
export class TableColumnComponent {
    @Input() header!: string;

    @ContentChild(TemplateRef)
    cellTemplate!: TemplateRef<any>;
}
