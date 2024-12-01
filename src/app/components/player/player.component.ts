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

    progressBarPercent: number = 0;
    currentTimeStamp: string = "0:00";
    isSeeking: boolean = false;
    volumeLevel: number = 100;
    previousVolume: number = 100;
    playlists: PlaylistSummary[] = [];


    @ViewChild('playlistTemplate') playlistTemplate!: TemplateRef<any>;

    constructor(
        private songService: SongService,
        private modalService: ModalService,
        private playlistService: PlaylistService,
        private audioService: AudioService) {
        this.loadPlaylists();
    }

    ngOnInit(): void {
        this.songService.currentSong$.subscribe(song => {
            if (song) {
                this.currentSong = song;
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

    nextSong() : void{
        this.songService.currentSong = this.isShuffle ? this.songService.randomSong : this.songService.nextSong;
    }

    prevSong() : void{
        this.songService.currentSong = this.isShuffle ? this.songService.randomSong : this.songService.previousSong;
    }

    updateProgress(event: Event): void {
        this.progressBarPercent = (this.audioService.getCurrentTime() / this.audioService.getDuration()) * 100;
        this.currentTimeStamp = this.formatTime(this.audioService.getCurrentTime());
    }

    onSliderInput(event: Event): void {
        this.isSeeking = true;
        const input = event.target as HTMLInputElement;
        this.progressBarPercent = +input.value;
    }

    seekAudio(event: Event): void {

        const input = event.target as HTMLInputElement;
        const seekTime = (parseFloat(input.value) / 100) * this.audioService.getDuration();
        this.audioService.seekTo(seekTime);
        this.isSeeking = false;
    }

    onProgressClick(event: MouseEvent): void {
        const progressBar = event.currentTarget as HTMLElement;
        const clickPosition = event.offsetX / progressBar.clientWidth;
        const seekTime = clickPosition * this.audioService.getDuration();

        this.audioService.seekTo(seekTime);
        this.progressBarPercent = clickPosition * 100;
    }

    private formatTime(seconds: number): string {
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
        this.playlistService.addSongToPlaylist(this.songService.currentSong?.guid || "", playlist.guid);
    }
}
