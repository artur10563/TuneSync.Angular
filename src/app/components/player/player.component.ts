import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song/Song.model';
import { SongService } from '../../services/song.service';
import { ModalService } from '../../services/modal.service';
import { PlaylistService } from '../../services/playlist.service';
import { AudioService } from '../../services/audio.service';
import { PlaylistListModalComponent } from '../playlist-list-modal/playlist-list-modal.component';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';


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

    constructor(
        private songService: SongService,
        private modalService: ModalService,
        private playlistService: PlaylistService,
        private audioService: AudioService) {
    }

    ngOnInit(): void {
        const audioElement = this.audioService.audio;

        this.volumeLevel = this.audioService.audio.volume * 100;

        audioElement.addEventListener('timeupdate', () => {
            this.currentTime = this.audioService.getCurrentTime();
        });

        this.playlistService.playlists$.subscribe((playlists) => {
            this.playlists = playlists;
        })

        this.audioService.currentSong$.subscribe(song => {
            if (song) {
                this.currentSong = song;
                this.maxAudioLength = this.convertToSeconds(song.audioLength);
                document.title = song.title;
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
        this.audioService.goToNextSong();
    }

    prevSong(): void {
        this.audioService.goToPreviousSong();
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

    openModal() {
        const modalConfig = {
            title: 'Select a Playlist'
        };

        const context = {
            playlists: this.playlists,
            songGuid: this.audioService.currentSong?.guid || ""
        };

        this.modalService.openComponentModal(PlaylistListModalComponent, context, modalConfig);
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
