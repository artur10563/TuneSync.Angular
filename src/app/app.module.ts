import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

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

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        YoutubeVideoComponent,
        SongTableComponent,
        PlayerComponent,
        AuthComponent,
        MainLayoutComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        provideHttpClient(
            withInterceptors([AuthInterceptor])
        )
    ]
})
export class AppModule { }
