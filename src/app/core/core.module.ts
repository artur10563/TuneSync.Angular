import { NgModule, Optional, SkipSelf } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { UISharedModule } from '../shared/ui-shared.module';
import { PlayerComponent } from './components/player/player.component';

@NgModule({
    declarations: [PlayerComponent],
    imports: [UISharedModule],
    exports: [PlayerComponent],
    providers: [
        provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: { darkModeSelector: '.my-app-dark' }
            }
        }),
        MessageService
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parent: CoreModule) {
        if (parent) {
            throw new Error('CoreModule is already loaded. Import only in AppModule.');
        }
    }
}