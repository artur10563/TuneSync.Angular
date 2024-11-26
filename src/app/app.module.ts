import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenericModalComponent } from './components/shared/generic-modal/generic-modal.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { YoutubeVideoComponent } from './components/youtube-video/youtube-video.component';
import { SongTableComponent } from './components/song-table/song-table.component';
import { PlayerComponent } from './components/player/player.component';
import { AuthComponent } from './components/auth/auth.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NotificationComponent } from './components/notification/notification.component';
import { PlaylistComponent } from './components/playlist/playlist.component';


@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        YoutubeVideoComponent,
        SongTableComponent,
        PlayerComponent,
        AuthComponent,
        MainLayoutComponent,
        GenericModalComponent,
        NotificationComponent,
        PlaylistComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        BrowserAnimationsModule
    ],
    providers: [
        provideHttpClient(
            withInterceptors([AuthInterceptor])
        )
    ]
})
export class AppModule { }
