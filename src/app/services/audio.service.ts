import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    constructor() { }

    private audioElement = new Audio();  // Centralized audio element
    get audio(): HTMLAudioElement {
        return this.audioElement;
    }
    //#region Subjects
    private _isPlaying = new BehaviorSubject<boolean>(false);
    isPlaying$ = this._isPlaying.asObservable();

    private _isShuffle = new BehaviorSubject<boolean>(false);
    isShuffle$ = this._isShuffle.asObservable();

    private _isRepeat = new BehaviorSubject<boolean>(false);
    isRepeat$ = this._isRepeat.asObservable();

    private _currentTimeSubject = new BehaviorSubject<number>(0);
    currentTime$ = this._currentTimeSubject.asObservable();

    private _progressSubject = new BehaviorSubject<number>(0);
    progress$ = this._progressSubject.asObservable();

    //#endregion
    //#region Subject Getters/Setters
    set isShuffle(isShuffle: boolean) {
        this._isShuffle.next(isShuffle);
    }

    set isPlaying(isPlaying: boolean) {
        this._isPlaying.next(isPlaying);
    }

    set isRepeat(isRepeat: boolean) {
        this._isRepeat.next(isRepeat);
    }

    get isShuffle() {
        return this._isShuffle.value;
    }

    get isRepeat() {
        return this._isRepeat.value;
    }
    //#endregion
    togglePlay(): void {
        if (this._isPlaying.value) {
            this.audioElement.pause();
        } else {
            this.audioElement.play();
        }
        this._isPlaying.next(!this._isPlaying.value);
    }

    toggleShuffle(): void {
        this._isShuffle.next(!this._isShuffle.value);
    }

    toggleRepeat(): void {
        this._isRepeat.next(!this._isRepeat.value);
    }

    loadAudio(audioSrc: string, onEndedCallback: () => void) {
        this.audio.src = audioSrc;
        this.audio.load();

        this.audio.oncanplaythrough = () => {
            this.audio.play();
            this.isPlaying = true;
        };

        this.audio.onended = () => {
            onEndedCallback();
        }
    }

    setVolume(volume: number): void {
        this.audio.volume = volume / 100;
    }

    seekTo(time: number): void {
        this.audio.currentTime = time;
    }

    getCurrentTime(): number {
        return this.audio.currentTime;
    }

    getDuration(): number {
        return this.audio.duration;
    }
}
