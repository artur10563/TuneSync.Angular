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
import { HomeComponent } from './components/home/home.component';
import { MatSliderModule } from '@angular/material/slider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { YoutubePlaylistComponent } from './components/youtube-playlist/youtube-playlist.component';
import { ArtistComponent } from './components/artist/artist.component'
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { PlaylistListModalComponent } from './components/playlist-list-modal/playlist-list-modal.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { FavoriteComponent } from './components/favorite/favorite.component'

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
        PlaylistComponent,
        HomeComponent,
        YoutubePlaylistComponent,
        ArtistComponent,
        PlaylistListModalComponent,
        ModalComponent,
        FavoriteComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatButtonModule,
        MatMenuModule, 
        MatIconModule
    ],
    providers: [
        provideHttpClient(
            withInterceptors([AuthInterceptor])
        ),
        provideAnimationsAsync()
    ]
})
export class AppModule { }
