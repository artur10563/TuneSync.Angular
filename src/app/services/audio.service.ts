import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/Song.model';

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

    private songQueueSubject = new BehaviorSubject<Song[]>([]);
    songQueue$ = this.songQueueSubject.asObservable();

    private currentSongSubject = new BehaviorSubject<Song | null>(null);
    currentSong$ = this.currentSongSubject.asObservable();

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

    get currentSong(): Song | null {
        return this.currentSongSubject.getValue();
    }

    set songQueue(songs: Song[]) {
        this.songQueueSubject.next(songs);
    }

    get songQueue(): Song[] {
        return this.songQueueSubject.getValue();
    }

    set currentSong(song: Song | null) {
        if (song) {
            this.currentSongSubject.next(song);

            this.loadAudio(song.audioPath, () => this.handleSongEnd());
        }
    }


    get randomSong(): Song | null {
        const songs = this.songQueue;
        if (songs.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * songs.length);
        return songs[randomIndex];
    }


    get nextSong(): Song | null {
        const songs = this.songQueue;
        const current = this.currentSong;
        if (!current) return null;
        const index = songs.findIndex((s) => s.guid === current.guid);
        return songs[index + 1] || songs[0] || null;
    }

    get previousSong(): Song | null {
        const songs = this.songQueue;
        const current = this.currentSong;
        if (!current) return null;
        const index = songs.findIndex((s) => s.guid === current.guid);
        return songs[index - 1] || songs[0] || null;
    }

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
    //#endregion

    private handleSongEnd(): void {
        let nextSong: Song | null = null;

        if (this.isShuffle) {
            nextSong = this.randomSong;
        } else if (this.isRepeat) {
            nextSong = this.currentSongSubject.value;
        } else {
            nextSong = this.nextSong;
        }

        if (nextSong) {
            this.currentSong = nextSong;
        } else {
            this.currentSong = this.randomSong;
        }
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
