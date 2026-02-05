import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SafeBrowserService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    get isBrowserPlatform(): boolean {
        return this.isBrowser;
    }

    // LocalStorage
    get(key: string): string | null {
        return this.isBrowser ? localStorage.getItem(key) : null;
    }

    set(key: string, value: string): void {
        if (this.isBrowser) localStorage.setItem(key, value);
    }

    remove(key: string): void {
        if (this.isBrowser) localStorage.removeItem(key);
    }

    clear(): void {
        if (this.isBrowser) localStorage.clear();
    }

    // Document
    get title(): string {
        return this.isBrowser ? document.title : '';
    }

    set title(title: string) {
        if (this.isBrowser) document.title = title;
    }

    // Audio
    createAudio(src?: string): HTMLAudioElement | null {
        if (!this.isBrowser) return null;
        return new Audio(src);
    }

    // Browser
    get mediaSession(): MediaSession | null {
    if (this.isBrowser && 'mediaSession' in navigator) {
        return navigator.mediaSession;
    }
    return null;
}
}
