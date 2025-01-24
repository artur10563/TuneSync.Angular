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

    private playedSongGuids: string[] = [];

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
            if (this.currentSong != null) {
                this.playedSongGuids.push(this.currentSong.guid);
            }

            const unplayedSongs = this.songQueue.filter(song => !this.playedSongGuids.includes(song.guid));
            if (unplayedSongs.length > 0) {
                nextSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
            } else {
                this.clearPlayedSongs();
                nextSong = this.randomSong;
            }
        } else if (this.isRepeat) {
            nextSong = this.currentSongSubject.value;
        } else {
            nextSong = this.nextSong;
        }

        if (nextSong) {
            this.currentSong = nextSong;
        }
    }

    private clearPlayedSongs(): void {
        this.playedSongGuids = [];
    }

    loadAudio(audioSrc: string, onEndedCallback: () => void) {
        this.audio.src = audioSrc;
        this.audio.load();

        this.audio.oncanplaythrough = () => {
            this.audio.play();
            this.isPlaying = true;
        };

        this.audio.onended = () => {
            if (onEndedCallback) {
                onEndedCallback();
            }
        };
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

    goToNextSong(): void {
        if (this.isShuffle) {
            if (this.currentSong != null) {
                this.playedSongGuids.push(this.currentSong.guid);
            }
            const unplayedSongs = this.songQueue.filter(song => !this.playedSongGuids.includes(song.guid));
            if (unplayedSongs.length > 0) {
                this.currentSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
            } else {
                this.clearPlayedSongs();
                this.currentSong = this.randomSong;
            }
        } else {
            this.currentSong = this.nextSong;
        }
    }

    goToPreviousSong(): void {
        if (this.isShuffle) {
            if (this.playedSongGuids.length > 0) {
                let previousSongGuid: string | undefined;

                do {
                    previousSongGuid = this.playedSongGuids.pop();
                    if (previousSongGuid) {
                        const previousSong = this.songQueue.find(song => song.guid === previousSongGuid);
                        if (previousSong && previousSong.guid !== this.currentSong?.guid) {
                            this.currentSong = previousSong;
                            return;
                        }
                    }
                } while (previousSongGuid);

                console.log('No previous song found or already playing the same song.');
            } else {
                console.log('No played songs available.');
            }
        } else {
            this.currentSong = this.previousSong;
        }
    }
}
