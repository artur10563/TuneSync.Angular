import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Basic shared components
import { ModalComponent } from './components/modal/modal.component';
import { ImageComponent } from './components/image-component/image.component';

// Directives
import { SheetOverlayDirective } from './directives/sheet-overlay.directive';
import { RequireRoleDirective } from './directives/require-role.directive';

// Pipes
import { FormatDurationPipe } from './pipes/format-duration.pipe';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { GenericModalComponent } from './components/generic-modal/generic-modal.component';

@NgModule({
    declarations: [
        GenericModalComponent,
        ModalComponent,
        ImageComponent,
        RequireRoleDirective,
        SheetOverlayDirective,
        FormatDurationPipe,
        PluralizePipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        GenericModalComponent,
        ModalComponent,
        ImageComponent,
        SheetOverlayDirective,
        RequireRoleDirective,
        FormatDurationPipe,
        PluralizePipe
    ]
})
export class BaseSharedModule { }

