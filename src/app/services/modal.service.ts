import { Injectable, TemplateRef, Type } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModalComponent } from '../components/shared/generic-modal/generic-modal.component';
import { ModalComponentConfig, ModalConfig } from '../models/modal.model';
import { ModalComponent } from '../components/shared/modal/modal.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    constructor(private modalService: NgbModal) { }

    openGenericModal(config: ModalConfig, customTemplate?: TemplateRef<any>, context?: any) {
        const modalRef = this.modalService.open(GenericModalComponent, {
            centered: true,
            backdrop: true
        });

        modalRef.componentInstance.config = config;
        modalRef.componentInstance.customTemplate = customTemplate;
        modalRef.componentInstance.context = context;
        return modalRef.result;
    }

    openComponentModal(component: Type<any>, context: any = {}, modalConfig: ModalComponentConfig = { title: 'Default Title' }) {
        const modalRef = this.modalService.open(ModalComponent, {
            centered: true,
            backdrop: true,
        });


        modalRef.componentInstance.context = context;
        modalRef.componentInstance.childComponent = component;
        modalRef.componentInstance.title = modalConfig.title;
        modalRef.componentInstance.executeButtonLabel = modalConfig.confirmButtonText;
        modalRef.componentInstance.executeCallback = modalConfig.executeCallback;

        modalRef.componentInstance.modalRef = modalRef;

        return modalRef;
    }

    openDownloadModal(title: string, author: string) {
        const config: ModalConfig = {
            title: 'Download Song',
            fields: [
                {
                    type: 'text',
                    name: 'title',
                    label: 'Title',
                    value: title,
                    required: true,
                    placeholder: 'Enter song title'
                },
                {
                    type: 'text',
                    name: 'author',
                    label: 'Author',
                    value: author,
                    required: true,
                    placeholder: 'Enter author name'
                }
            ],
            confirmButtonText: 'Download',
            confirmButtonClass: 'btn-primary'
        };

        return this.openGenericModal(config);
    }

    openModalFromTemplate(modalTemplate: TemplateRef<any>, context?: any) {
        const modalRef = this.modalService.open(modalTemplate, {
            centered: true
        });
        if (context)
            modalRef.componentInstance.context = context;
        return modalRef.result; // Returns a promise with modal result ('Yes', 'No', etc.)
    }
} 