import { NgModule } from '@angular/core';
import { BaseSharedModule } from './base-shared.module';

// Components that need UI libraries
import { SheetComponent } from './components/sheet-overlay/sheet-overlay.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';
import { PlaylistCardComponent } from './components/playlist-card/playlist-card.component';
import { PlaylistListModalComponent } from './components/playlist-list-modal/playlist-list-modal.component';
import { SongTableComponent } from './components/song-table/song-table.component';
import { YoutubePlaylistComponent } from './components/youtube-playlist/youtube-playlist.component';
import { YoutubeVideoComponent } from './components/youtube-video/youtube-video.component';

// PrimeNG modules
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

// Angular Material
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

// Infinite scroll
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@NgModule({
    declarations: [
        SongTableComponent,
        PlaylistCardComponent,
        ArtistCardComponent,
        PlaylistListModalComponent,
        YoutubeVideoComponent,
        YoutubePlaylistComponent,
        SheetComponent
    ],
    imports: [
        BaseSharedModule,
        MatSliderModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        CarouselModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        SplitButtonModule,
        CheckboxModule,
        AvatarModule,
        SkeletonModule,
        DropdownModule,
        MenuModule,
        TieredMenuModule,
        SelectModule,
        TagModule,
        InfiniteScrollDirective
    ],
    exports: [
        BaseSharedModule,
        MatSliderModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        CarouselModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        SplitButtonModule,
        CheckboxModule,
        AvatarModule,
        SkeletonModule,
        DropdownModule,
        MenuModule,
        TieredMenuModule,
        SelectModule,
        TagModule,
        SongTableComponent,
        PlaylistCardComponent,
        ArtistCardComponent,
        PlaylistListModalComponent,
        YoutubeVideoComponent,
        YoutubePlaylistComponent,
        SheetComponent,
        InfiniteScrollDirective
    ]
})
export class UISharedModule { }

