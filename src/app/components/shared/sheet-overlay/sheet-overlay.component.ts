import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { AudioService } from '../../../services/audio.service';
import { Song } from '../../../models/Song/Song.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sheet',
    templateUrl: './sheet-overlay.component.html',
    styleUrls: ['./sheet-overlay.component.scss'],
    animations: [
        trigger('slide', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('300ms ease-out', style({ transform: 'translateY(0%)' }))
            ]),
            transition('open => closed', [
                animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]
})
export class SheetComponent implements OnInit, OnDestroy {
    constructor(public audioService: AudioService) { }


    @Output() closed = new EventEmitter<void>();

    animationState: 'open' | 'closed' = 'open';

    onClose() {
        this.animationState = 'closed';
    }

    animationDone(event: any) {
        if (event.toState === 'closed') {
            this.closed.emit();
        }
    }


    //TODO: make sheet generic
    //#region SongLogic

    currentSong: Song | null = null;
    private songSubscription: Subscription = Subscription.EMPTY;

    ngOnInit() {
        this.songSubscription = this.audioService.currentSong$.subscribe(
            song => {
                this.currentSong = song;
            }
        );
    }
    ngOnDestroy() {
        this.songSubscription.unsubscribe();
      }
    //#endregion
}
