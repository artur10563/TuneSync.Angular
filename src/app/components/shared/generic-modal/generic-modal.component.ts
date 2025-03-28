import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../../../models/modal.model';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html'
})
export class GenericModalComponent implements OnInit {
  @Input() config!: ModalConfig;
  @Input() customTemplate?: TemplateRef<any>;
  form!: FormGroup;
context: any;

  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.config.fields) {
      this.createForm();
    }
  }

  private createForm() {
    const group: any = {};
    
    this.config.fields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      if (field.validators) {
        validators.push(...field.validators);
      }
      group[field.name] = [field.value || '', validators];
    });
    
    this.form = this.fb.group(group);
  }

  confirm() {
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
} 