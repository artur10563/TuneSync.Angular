import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Song } from '../../models/Song.model';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnChanges {
    @Input() song!: Song;

    isPlaying: boolean = false;
    progressBarPercent: number = 0;
    currentTimeStamp: string = "0:00";
    isSeeking: boolean = false; // Flag to handle seeking state

    @ViewChild('audioRef') audioElement!: ElementRef<HTMLAudioElement>;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['song'] && this.song && this.audioElement) {
            this.audioElement.nativeElement.src = this.song.audioPath;
            this.audioElement.nativeElement.load();

            this.audioElement.nativeElement.oncanplaythrough = () => {
                this.audioElement.nativeElement.play();
                this.isPlaying = true;
            };
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioElement.nativeElement.pause();
        } else {
            this.audioElement.nativeElement.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    updateProgress(event: Event) {
        // Only update if not seeking
        if (!this.isSeeking) {
            const audio = this.audioElement.nativeElement;
            this.progressBarPercent = (audio.currentTime / audio.duration) * 100;
            this.currentTimeStamp = this.formatTime(audio.currentTime);
        }
    }

    onSliderInput(event: Event) {
        // Mark as seeking to prevent updateProgress from overriding slider input
        this.isSeeking = true;
        const input = event.target as HTMLInputElement;
        this.progressBarPercent = +input.value;
    }

    seekAudio(event: Event) {
        // Finalize seek when user releases slider
        const input = event.target as HTMLInputElement;
        const seekTime = (parseFloat(input.value) / 100) * this.audioElement.nativeElement.duration;
        this.audioElement.nativeElement.currentTime = seekTime;
        this.isSeeking = false; // Reset seeking flag
    }

    onProgressClick(event: MouseEvent) {
        // Calculate the clicked position and seek audio
        const progressBar = event.currentTarget as HTMLElement;
        const clickPosition = event.offsetX / progressBar.clientWidth;
        const seekTime = clickPosition * this.audioElement.nativeElement.duration;

        this.audioElement.nativeElement.currentTime = seekTime;
        this.progressBarPercent = clickPosition * 100; // Update progress bar visually
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Format to MM:SS
    }
}
