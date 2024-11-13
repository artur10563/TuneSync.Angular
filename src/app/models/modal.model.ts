export interface ModalField {
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  name: string;
  label: string;
  value?: any;
  required?: boolean;
  options?: { value: any; label: string }[];
  placeholder?: string;
  validators?: any[];
}

export interface ModalConfig {
  title: string;
  fields: ModalField[];
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
} 