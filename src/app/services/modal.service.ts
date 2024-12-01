import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericModalComponent } from '../components/shared/generic-modal/generic-modal.component';
import { ModalConfig } from '../models/modal.model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  openGenericModal(config: ModalConfig, customTemplate?: TemplateRef<any>, context?: any) {
    const modalRef = this.modalService.open(GenericModalComponent, {
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.config = config;
    modalRef.componentInstance.customTemplate = customTemplate;
    modalRef.componentInstance.context = context;
    return modalRef.result;
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
} 