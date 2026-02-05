import { afterNextRender, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/Song/Song.model';
import { SongSource } from './song-sources/song-source.interface';
import { NotificationService } from '../core/services/notification.service';
import { SafeBrowserService } from '../core/services/safe-browser.service';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private audioElement: HTMLAudioElement | null = null;

    constructor(
        private notificationService: NotificationService,
        private safeLocalStorage: SafeBrowserService) {

        this.audioElement = this.safeLocalStorage.createAudio();

        this.currentSong$.subscribe((song) => {
            this.fetchNextPageIfThreshold();
        });

        this.audioElement?.addEventListener("play", () => this.isPlaying = true);
        this.audioElement?.addEventListener("pause", () => this.isPlaying = false);
        this.audioElement?.addEventListener("ended", () => this.handleSongEnd());
        this.setupMediaSession()

        this.currentSong$.subscribe((currentSong) => {
            if (currentSong)
                this.updateMediaSession(currentSong);
        });

        afterNextRender(() => {
            const savedVolume = this.safeLocalStorage.get('audioVolume');
            if (savedVolume) {
                this.setVolume(Number(savedVolume));
            }
        })
    }

    get audio(): HTMLAudioElement | null {
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

    private _currentSongSource: SongSource | null = null;
    private queueEndMessageDisplayed = false;

    //#endregion

    //#region Subject Getters/Setters

    get currentSongSource(): SongSource | null {
        return this._currentSongSource;
    }

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

    appendToSongQueue(songs: Song[]) {
        let seenSongs = new Set(this.songQueue.map(s => s.guid));
        const newSongs = songs.filter(s => {
            if (seenSongs.has(s.guid)) return false;
            seenSongs.add(s.guid);
            return true;
        });
        return this.songQueueSubject.next([...this.songQueue, ...newSongs]);
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

        const index = queue.findIndex(s => s.guid === current.guid);
        if (index === -1) return null;

        return queue[index + 1] ?? null;
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
    //#endregion

    //#region Audio Control Methods
    togglePlay(): void {
        if (!this.audioElement) return;

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
        if (!this.audio) return;

        this.audio.src = audioSrc;
        this.audio.load();

        this.audio.oncanplaythrough = () => {
            this.audio?.play();
            this.isPlaying = true;
        };
    }

    setVolume(volume: number): void {
        if (!this.audio) return;

        this.audio.volume = volume / 100;
        this.safeLocalStorage.set('audioVolume', volume.toString());
    }

    seekTo(time: number): void {
        if (!this.audio) return;

        this.audio.currentTime = time;
    }

    getCurrentTime(): number {
        if (!this.audio) return -1;

        return this.audio.currentTime;
    }

    getDuration(): number {
        if (!this.audio) return -1;

        return this.audio.duration;
    }

    //#endregion

    //#region MediaSession

    private setupMediaSession() {
        if (!this.audioElement) return;
        const mediaSession = this.safeLocalStorage.mediaSession;
        if (!mediaSession) return;

        mediaSession.setActionHandler('play', () => {
            this.audioElement?.play();
        });

        mediaSession.setActionHandler('pause', () => {
            this.audioElement?.pause();
        });

        mediaSession.setActionHandler('previoustrack', () => {
            this.goToPreviousSong();
        });

        mediaSession.setActionHandler('nexttrack', () => {
            this.goToNextSong();
        });
    }

    private updateMediaSession(song: Song) {
        const mediaSession = this.safeLocalStorage.mediaSession;
        if (!mediaSession) return;

        mediaSession.metadata = new MediaMetadata({
            album: song.album,
            artist: song.artist.displayName,
            title: song.title,
            artwork: [{ src: song.thumbnailUrl || "", type: 'image/png' }]
        });
    }

    //#endregion


    isCurrentlyPlayingFromSource(source: SongSource): boolean {
        return this.currentSongSource === source;
    }

    setCurrentSongSource(source: SongSource) {
        console.log("Settings current song source to", source.constructor.name);
        if (this.isCurrentlyPlayingFromSource(source)) {
            console.log("Same song source, skipping setCurrentSongSource");
            return;
        }

        this._currentSongSource = source;

        const useSongs = (songs: Song[]) => {
            this.songQueue = songs;
            if (this.songQueue.length > 0) {
                this.currentSong = this.songQueue[0];
            }
        }

        if (source.cachedSongs && source.cachedSongs.length > 0) {
            useSongs(source.cachedSongs);
            return; //Return early so we dont fetch songs again
        }

        source.loadInitial().subscribe({
            next: (songs) => {
                useSongs(songs);
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    private fetchNextPageIfThreshold() {

        const songSource = this.currentSongSource;

        if (!songSource) return;
        if (!songSource.hasNextPage()) {
            if (!this.queueEndMessageDisplayed) {

                this.notificationService.show("All songs for current queue were discovered", "info");
                this.queueEndMessageDisplayed = true;
            }
            return;
        }

        const totalSongsCount = this.currentSongSource.cachedSongs.length;

        const currentSongIndex = this.currentSong
            ? this.currentQueue.findIndex(s => s.guid === this.currentSong!.guid)
            : -1;

        const fetchThreshold = totalSongsCount - this.currentSongSource.fetchThreshold;
        const thresholdReached = fetchThreshold <= currentSongIndex;
        const isAtQueueEnd = this.nextSong == this.currentQueue[0] || this.nextSong === null;

        this.logFetchStatus(totalSongsCount, currentSongIndex, fetchThreshold, isAtQueueEnd);


        // Check if threshold% of songs have been played
        if ((thresholdReached || isAtQueueEnd) && songSource.hasNextPage()) {
            songSource.loadNextPage().subscribe({
                next: (songs) => {
                    this.appendToSongQueue(songs)
                    this.queueEndMessageDisplayed = false;
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                    this.queueEndMessageDisplayed = true;
                }, complete:
                    () => {
                    }
            });
        }
    }

    private logFetchStatus(
        total: number,
        currentIndex: number,
        fetchThreshold: number,
        isAtQueueEnd: boolean
    ) {
        console.log(`
            Total songs:        ${total}
            Fetch threshold:    ${fetchThreshold}%
            Current song index: ${currentIndex}
            Page:               ${this.currentSongSource?.pageInfo.page}/${this.currentSongSource?.pageInfo.totalPages}
            Has next page:      ${this.currentSongSource?.hasNextPage() ? 'Yes' : 'No'}
            Is at queue end:    ${isAtQueueEnd ? 'Yes' : 'No'}
            `);
    }


    //#endregion

}