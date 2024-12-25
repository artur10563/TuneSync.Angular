import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Song } from '../../models/Song.model';
import { SongService } from '../../services/song.service';
import { ModalService } from '../../services/modal.service';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistSummary } from '../../models/Playlist.model';
import { AudioService } from '../../services/audio.service';


@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
    currentSong: Song | null = null;
    isPlaying: boolean = false;
    isShuffle: boolean = false;
    isRepeat: boolean = false;

    volumeLevel: number = 100;
    previousVolume: number = 100;
    playlists: PlaylistSummary[] = [];

    maxAudioLength: number = 0;
    currentTime: number = 0;

    @ViewChild('playlistTemplate') playlistTemplate!: TemplateRef<any>;

    constructor(
        private songService: SongService,
        private modalService: ModalService,
        private playlistService: PlaylistService,
        private audioService: AudioService) {
    }

    ngOnInit(): void {
        const audioElement = this.audioService.audio;
        this.loadPlaylists();

        audioElement.addEventListener('timeupdate', () => {
            this.currentTime = this.audioService.getCurrentTime();
        });

        this.audioService.currentSong$.subscribe(song => {
            if (song) {
                this.currentSong = song;
                this.maxAudioLength = this.convertToSeconds(song.audioLength);
            }
        });

        this.audioService.isPlaying$.subscribe(isPlaying => {
            this.isPlaying = isPlaying;
        });

        this.audioService.isShuffle$.subscribe(isShuffle => {
            this.isShuffle = isShuffle;
        });

        this.audioService.isRepeat$.subscribe(isRepeat => {
            this.isRepeat = isRepeat;
        });
    }

    togglePlay(): void {
        this.audioService.togglePlay();
    }

    toggleShuffle(): void {
        this.audioService.toggleShuffle();
    }

    toggleRepeat(): void {
        this.audioService.toggleRepeat();
    }

    nextSong(): void {
        this.audioService.currentSong = this.isShuffle ? this.audioService.randomSong : this.audioService.nextSong;
    }

    prevSong(): void {
        this.audioService.currentSong = this.isShuffle ? this.audioService.randomSong : this.audioService.previousSong;
    }

    seekAudio(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.audioService.seekTo(parseInt(input.value, 10));
    }

    formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.volumeLevel = +input.value;
        this.audioService.setVolume(this.volumeLevel);
    }

    toggleMute(): void {
        if (this.volumeLevel > 0) {
            this.previousVolume = this.volumeLevel;
            this.volumeLevel = 0;
        } else {
            this.volumeLevel = this.previousVolume;
        }
        this.audioService.setVolume(this.volumeLevel);
    }

    getVolumeIcon(): string {
        if (this.volumeLevel === 0) {
            return 'bi bi-volume-mute-fill';
        } else if (this.volumeLevel < 50) {
            return 'bi bi-volume-down-fill';
        } else {
            return 'bi bi-volume-up-fill';
        }
    }

    private loadPlaylists() {
        this.playlistService.getCurrentUserPlaylists().subscribe(playlists => {
            this.playlists = playlists;
            console.log(playlists);
        });
    }

    openPlaylistModal() {
        const config = {
            title: 'Select a Playlist',
            confirmButtonText: 'Close',
            cancelButtonText: 'Cancel',
            fields: []
        };

        this.modalService.openGenericModal(config, this.playlistTemplate, {
            onClick: (playlist: PlaylistSummary) => this.onPlaylistClick(playlist)
        });
    }

    onPlaylistClick(playlist: PlaylistSummary) {
        this.playlistService.addSongToPlaylist(this.audioService.currentSong?.guid || "", playlist.guid);
    }

    private convertToSeconds(audioLength: string): number {
        const parts = audioLength.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        return hours * 60 * 60 + minutes * 60 + seconds;
    }

    toggleFavorite(song: Song) {
        this.songService.toggleFavorite(song);
    }
}
