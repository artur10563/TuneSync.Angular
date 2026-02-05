import { Component, ContentChild, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { PlaylistSummary } from '../../../models/Playlist/PlaylistSummary.mode';
import { Song } from '../../../models/Song/Song.model';
import { AudioService } from '../../../services/audio.service';
import { ModalService } from '../../../services/modal.service';
import { PlaylistService } from '../../../services/playlist.service';
import { SongSource } from '../../../services/song-sources/song-source.interface';
import { SongService } from '../../../services/song.service';
import { PlaylistListModalComponent } from '../playlist-list-modal/playlist-list-modal.component';
import { TableColumnComponent } from './table-column/table-column.component';


@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html',
    styleUrl: './song-table.component.css'
})
export class SongTableComponent implements OnInit {

    constructor(
        private songService: SongService,
        private audioService: AudioService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: ModalService,
        private playlistService: PlaylistService,
        private notificationService: NotificationService
    ) { }

    @ContentChild('songAction', { read: TemplateRef })
    songActionTemplate?: TemplateRef<{ $implicit: Song }>;

    // Extra columns
    @ContentChildren(TableColumnComponent)
    extraColumns!: QueryList<TableColumnComponent>;

    // DO NOT REMOVE. Overrides songSource logic.
    // Used to provide custom song list.
    // Requires manual pagination handling.
    // Do not use if possible. 
    @Input() songs?: Song[]

    @Input() songSource!: SongSource;

    @Input() displaySettings: DisplaySettings = {};

    currentSong: Song | null = null;
    isPlaying: boolean = false;

    playlists: PlaylistSummary[] = [];

    playlistId: string | null = null;

    isLoading: boolean = false;


    get mergedDisplaySettings(): DisplaySettings {
        const defaultSettings: DisplaySettings = {
            title: true,
            artist: true,
            album: true,
            thumbnail: true,
            duration: true,
            createdAt: true,
            isFavorite: true,
            menu: true
        };
        return { ...defaultSettings, ...this.displaySettings };
    }

    get displayedSongs(): Song[] {
        return this.songs ?? this.songSource?.cachedSongs ?? [];
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            //"/playlist/:guid"
            const playlistRegex = /^\/playlist\/[a-f0-9\-]+$/;

            const currentRoute = this.router.url;
            //we need it to check from which playlist we delete the song
            if (playlistRegex.test(currentRoute)) {
                const guid = params.get('guid');
                this.playlistId = guid;
            }
        });

        this.playlistService.playlists$.subscribe((playlists) => {
            this.playlists = playlists;
        })

        this.audioService.currentSong$.subscribe((song) => {
            this.currentSong = song;
        });

        this.audioService.isPlaying$.subscribe((isPlaying) => {
            this.isPlaying = isPlaying;
        });

    }

    onPlayClick(song: Song): void {
        if (this.currentSong?.guid !== song.guid) {
            if (!this.audioService.isCurrentlyPlayingFromSource(this.songSource))
                this.audioService.setCurrentSongSource(this.songSource);
            this.audioService.currentSong = song;
        } else
            this.audioService.togglePlay();
    }


    toggleFavorite(song: Song) {
        this.songService.toggleFavorite(song);
    }


    openPlaylistModal(songGuid: string) {
        const modalConfig = {
            title: 'Select a Playlist'
        };

        const context = {
            playlists: this.playlists,
            songGuid: songGuid
        };

        this.modalService.openComponentModal(PlaylistListModalComponent, context, modalConfig);
    }


    deleteFromPlaylist(playlistGuid: string, songGuid: string) {
        this.playlistService.deleteSongFromPlaylist(playlistGuid, songGuid).subscribe({
            next: () => {
                const index = this.songSource.cachedSongs.findIndex(item => item.guid === songGuid);
                this.songSource.cachedSongs.splice(index, 1);

            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    trackByGuid(index: number, song: Song): string {
        return song.guid;
    }


    fetchNextPage(): void {
        if ((!this.songSource.hasNextPage() && !this.songs) || this.isLoading) return;

        this.isLoading = true;

        this.songSource.loadNextPage().subscribe({
            next: () => {
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                this.notificationService.handleError(err);
            }
        });
    }
}

export interface DisplaySettings {
    title?: boolean;
    artist?: boolean;
    album?: boolean;
    thumbnail?: boolean;
    duration?: boolean;
    createdAt?: boolean;
    isFavorite?: boolean;
    menu?: boolean;
}