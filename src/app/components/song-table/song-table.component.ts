import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { Song } from '../../models/Song.model';

@Component({
    selector: 'app-song-table',
    templateUrl: './song-table.component.html',
    styleUrl: './song-table.component.css'
})
export class SongTableComponent {

    @Input()
    songs: Song[] = [];

    @ViewChildren('audioRef') audioElements!: QueryList<ElementRef<HTMLAudioElement>>;

    playAudio(guid: string): void {
        this.audioElements.forEach((audio) => {
            if (audio.nativeElement.id === `a-${guid}`) {
                audio.nativeElement.play();
            } else {
                audio.nativeElement.pause();
                audio.nativeElement.currentTime = 0;
            }
        });
    }

}