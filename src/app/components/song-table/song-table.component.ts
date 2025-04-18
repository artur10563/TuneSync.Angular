import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../models/Song/Song.model';
import { SongService } from '../../services/song.service';
import { AudioService } from '../../services/audio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistListModalComponent } from '../playlist-list-modal/playlist-list-modal.component';
import { NotificationService } from '../../services/notification.service';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';

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

    @Input() songs: Song[] = [];
    currentSong: Song | null = null;
    isPlaying: boolean = false;

    playlists: PlaylistSummary[] = [];

    playlistId: string | null = null;

    @Input() displaySettings: DisplaySettings = {};
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

    ngOnInit(): void {

        this.route.paramMap.subscribe(params => {
            //"/playlist/:guid"
            const playlistRegex = /^\/playlist\/[a-f0-9\-]+$/;

            const currentRoute = this.router.url;

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
            this.audioService.songQueue = this.songs;
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
                const index = this.songs.findIndex(item => item.guid === songGuid);
                this.songs.splice(index, 1);

            },
            error: (err) => this.notificationService.handleError(err)
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