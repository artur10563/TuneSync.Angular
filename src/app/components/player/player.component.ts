import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Song } from '../../models/Song.model';
import { SongService } from '../../services/song-service.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy {
    currentSong: Song | null = null;
    isPlaying: boolean = false;
    progressBarPercent: number = 0;
    currentTimeStamp: string = "0:00";
    isSeeking: boolean = false;
    volumeLevel: number = 100;
    previousVolume: number = 100;

    private currentSongSubscription!: Subscription;

    @ViewChild('audioRef') audioElement!: ElementRef<HTMLAudioElement>;

    constructor(private songService: SongService) { }

    ngOnInit(): void {
        // Subscribe to the current song from the service
        this.currentSongSubscription = this.songService.currentSong$.subscribe(song => {
            if (song) {
                this.loadSong(song);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.currentSongSubscription) {
            this.currentSongSubscription.unsubscribe();
        }
    }

    private loadSong(song: Song): void {
        this.currentSong = song;
        if (this.audioElement) {
            const audio = this.audioElement.nativeElement;
            audio.src = song.audioPath;
            audio.load();
            audio.oncanplaythrough = () => {
                audio.play();
                this.isPlaying = true;
            };
        }
    }

    togglePlay(): void {
        if (!this.audioElement) return;
        const audio = this.audioElement.nativeElement;
        if (this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    updateProgress(event: Event): void {
        if (!this.audioElement || this.isSeeking) return;
        const audio = this.audioElement.nativeElement;
        this.progressBarPercent = (audio.currentTime / audio.duration) * 100;
        this.currentTimeStamp = this.formatTime(audio.currentTime);
    }

    onSliderInput(event: Event): void {
        this.isSeeking = true;
        const input = event.target as HTMLInputElement;
        this.progressBarPercent = +input.value;
    }

    seekAudio(event: Event): void {
        if (!this.audioElement) return;
        const input = event.target as HTMLInputElement;
        const seekTime = (parseFloat(input.value) / 100) * this.audioElement.nativeElement.duration;
        this.audioElement.nativeElement.currentTime = seekTime;
        this.isSeeking = false;
    }

    onProgressClick(event: MouseEvent): void {
        if (!this.audioElement) return;
        const progressBar = event.currentTarget as HTMLElement;
        const clickPosition = event.offsetX / progressBar.clientWidth;
        const seekTime = clickPosition * this.audioElement.nativeElement.duration;

        this.audioElement.nativeElement.currentTime = seekTime;
        this.progressBarPercent = clickPosition * 100;
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    onVolumeChange(event: Event): void {
        if (!this.audioElement) return;
        const input = event.target as HTMLInputElement;
        this.volumeLevel = +input.value;
        this.audioElement.nativeElement.volume = this.volumeLevel / 100;
    }

    toggleMute(): void {
        if (!this.audioElement) return;
        if (this.volumeLevel > 0) {
            this.previousVolume = this.volumeLevel;
            this.volumeLevel = 0;
        } else {
            this.volumeLevel = this.previousVolume;
        }
        this.audioElement.nativeElement.volume = this.volumeLevel / 100;
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
}
