import { NgModule } from '@angular/core';
import { BaseSharedModule } from './base-shared.module';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
    declarations: [NotificationComponent],
    imports: [BaseSharedModule],
    exports: [NotificationComponent]
})
export class NotificationModule { }

