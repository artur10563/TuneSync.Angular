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
import { FavoriteComponent } from './components/favorite/favorite.component';
import { PlaylistCardComponent } from './components/playlist-card/playlist-card.component';
import { FavoriteSongsComponent } from './components/favorite-songs/favorite-songs.component';
import { FavoriteAlbumsComponent } from './components/favorite-albums/favorite-albums.component';
import { SheetComponent } from './components/shared/sheet-overlay/sheet-overlay.component';
import { SheetOverlayDirective } from './directives/sheet-overlay.directive';
import { SearchComponent } from './components/search/search.component'
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'
import { Toast } from 'primeng/toast'
import { SplitButton } from 'primeng/splitbutton'
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox'
import { AvatarModule } from 'primeng/avatar'
import { SkeletonModule } from 'primeng/skeleton';
import { RequireRoleDirective } from './directives/require-role.directive'
import { DropdownModule } from 'primeng/dropdown'
import { MenuModule } from 'primeng/menu'
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SelectModule } from 'primeng/select';
import { ArtistMergeComponent } from './components/admin-components/artist-merge/artist-merge.component';
import { TagModule } from 'primeng/tag';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';
import { InfiniteScrollDirective, InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageComponent } from './components/shared/image/image.component';

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
        FavoriteComponent,
        PlaylistCardComponent,
        FavoriteSongsComponent,
        FavoriteAlbumsComponent,
        SheetComponent,
        SheetOverlayDirective,
        SearchComponent,
        RequireRoleDirective,
        ArtistMergeComponent,
        ArtistSearchComponent,
        ArtistCardComponent,
        ImageComponent
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
        MatIconModule,
        CarouselModule,
        ButtonModule,
        DialogModule,
        Toast,
        SplitButton,
        CheckboxModule,
        AvatarModule,
        SkeletonModule,
        DropdownModule,
        MenuModule,
        TieredMenuModule,
        SelectModule,
        TagModule,
        // InfiniteScrollModule,
        InfiniteScrollDirective
    ],
    providers: [
        provideHttpClient(
            withInterceptors([AuthInterceptor])
        ),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.my-app-dark'
                }
            }
        }),
        MessageService
    ]
})
export class AppModule { }
