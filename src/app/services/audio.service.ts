import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/Song/Song.model';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    constructor() {
        const savedVolume = localStorage.getItem('audioVolume');
        if (savedVolume) {
            this.setVolume(Number(savedVolume));
        }

        this.audioElement.addEventListener("play", () => this.isPlaying = true);
        this.audioElement.addEventListener("pause", () => this.isPlaying = false);
        this.audioElement.addEventListener("ended", () => this.handleSongEnd());
        this.setupMediaSession()

        this.currentSong$.subscribe((currentSong) => {
            if (currentSong)
                this.updateMediaSession(currentSong);
        });
    }

    private audioElement = new Audio();
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

    private shuffledQueueSubject = new BehaviorSubject<Song[]>([]);
    shuffledSongQueue$ = this.shuffledQueueSubject.asObservable();

    private currentSongSubject = new BehaviorSubject<Song | null>(null);
    currentSong$ = this.currentSongSubject.asObservable();

    public playedSongGuids: string[] = [];

    //#endregion
    //#region Subject Getters/Setters
    set isShuffle(isShuffle: boolean) {
        this._isShuffle.next(isShuffle);
        if (isShuffle) {
            this.generateShuffledQueue();
        }
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
        if (this.isShuffle) {
            this.generateShuffledQueue();
        }
    }

    get songQueue(): Song[] {
        return this.songQueueSubject.getValue();
    }

    set shuffledSongQueue(songs: Song[]) {
        this.shuffledQueueSubject.next(songs);
    }

    get shuffledSongQueue(): Song[] {
        return this.shuffledQueueSubject.getValue();
    }

    set currentSong(song: Song | null) {
        if (song) {
            this.currentSongSubject.next(song);
            this.loadAudio(song.audioPath);
        }
    }

    get currentQueue(): Song[] {
        return this.isShuffle ? this.shuffledSongQueue : this.songQueue;
    }

    get nextSong(): Song | null {
        const queue = this.currentQueue;
        const current = this.currentSong;
        if (!current) return null;
        const index = queue.findIndex((s) => s.guid === current.guid);
        return queue[index + 1] || queue[0] || null;
    }

    get currentSongIndex(): number | null {
        const queue = this.currentQueue;
        const current = this.currentSong;
        if (!current) return null;
        const index = queue.findIndex((s) => s.guid === current.guid);
        return index;
    }
    get previousSong(): Song | null {
        const queue = this.currentQueue;
        const current = this.currentSong;
        if (!current) return null;
        const index = queue.findIndex((s) => s.guid === current.guid);
        return queue[index - 1] || queue[0] || null;
    }

    togglePlay(): void {
        if (this._isPlaying.value) {
            this.audioElement.pause();
        } else {
            this.audioElement.play();
        }
    }

    toggleShuffle(): void {
        this.isShuffle = !this.isShuffle;
    }

    toggleRepeat(): void {
        this._isRepeat.next(!this._isRepeat.value);
    }

    private handleSongEnd(): void {
        let nextSong: Song | null = null;

        if (this.isRepeat) {
            nextSong = this.currentSongSubject.value;
        } else {
            nextSong = this.nextSong;
        }

        if (nextSong) {
            this.currentSong = nextSong;
        }
    }

    goToNextSong(): void {
        if (this.isShuffle) {
            const queue = this.shuffledSongQueue;
            const current = this.currentSong;
            if (!current) return;

            const index = queue.findIndex((s) => s.guid === current.guid);
            this.currentSong = queue[index + 1] || queue[0];
        } else {
            this.currentSong = this.nextSong;
        }
    }

    goToPreviousSong(): void {
        if (this.isShuffle) {
            const queue = this.shuffledSongQueue;
            const current = this.currentSong;
            if (!current) return;

            const index = queue.findIndex((s) => s.guid === current.guid);
            this.currentSong = queue[index - 1] || queue[queue.length - 1];
        } else {
            this.currentSong = this.previousSong;
        }
    }

    private generateShuffledQueue(): void {
        const shuffled = [...this.songQueue].sort(() => Math.random() - 0.5);
        this.shuffledSongQueue = shuffled;
    }

    loadAudio(audioSrc: string) {
        this.audio.src = audioSrc;
        this.audio.load();

        this.audio.oncanplaythrough = () => {
            this.audio.play();
            this.isPlaying = true;
        };
    }

    setVolume(volume: number): void {
        this.audio.volume = volume / 100;
        localStorage.setItem('audioVolume', volume.toString());
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

    clearPlayedSongs(): void {
        this.playedSongGuids = []
    }

    //#region MediaSession

    private setupMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                this.audioElement.play();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                this.audioElement.pause();
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                this.goToPreviousSong();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                this.goToNextSong();
            });
        }
    }

    private updateMediaSession(song: Song) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                album: song.album,
                artist: song.artist.displayName,
                title: song.title,
                artwork: [{ src: song.thumbnailUrl || "", type: 'image/png' }]
            });
        }
    }

    //#endregion
}