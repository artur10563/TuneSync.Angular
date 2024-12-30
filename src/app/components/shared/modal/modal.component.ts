import { Component, Input, ViewChild, Type, ViewContainerRef, Injector, AfterViewInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-component',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent implements AfterViewInit {
    @Input() title: string = 'Default Title';
    @Input() executeButtonLabel: string = 'Confirm';
    @Input() executeCallback: () => void = () => { };
    @Input() childComponent!: Type<any>;
    @Input() context: any;

    @Input() modalRef!: NgbModalRef;

    @ViewChild('modalContent', { read: ViewContainerRef }) modalContent!: ViewContainerRef;

    constructor(private injector: Injector) { }

    ngAfterViewInit() {
        if (this.childComponent && this.modalContent) {
            const componentRef = this.modalContent.createComponent(this.childComponent, {
                injector: this.injector,
            });

            if (this.context) {
                Object.assign(componentRef.instance, this.context);
            }
        }
    }

    dismiss() {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

    execute() {
        if (this.executeCallback) {
            this.executeCallback();
        }
    }
}
