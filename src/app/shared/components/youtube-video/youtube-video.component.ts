import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { YoutubePlaylistComponent } from '../youtube-playlist/youtube-playlist.component';
import { NotificationService } from '../../../core/services/notification.service';
import { YoutubeSong } from '../../../models/Youtube/YoutubeSong.model';
import { ModalService } from '../../../services/modal.service';
import { PlaylistService } from '../../../services/playlist.service';
import { SongService } from '../../../services/song.service';

@Component({
    selector: 'app-youtube-video',
    templateUrl: './youtube-video.component.html',
    styleUrls: ['./youtube-video.component.css']
})
export class YoutubeVideoComponent {

    @Input()
    song!: YoutubeSong;

    safeUrl: SafeUrl = "";

    public isUploading = false;

    constructor(
        private sanitizer: DomSanitizer,
        private songService: SongService,
        private modalService: ModalService,
        private playlistService: PlaylistService,
        private notificationService: NotificationService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['song'] && this.song?.id) {
            this.updateSafeUrl();
        }
    }


    private updateSafeUrl(): void {
        const url = `https://www.youtube.com/embed/${this.song.id}?rel=0`;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    uploadAudio(): void {

        this.isUploading = true;
        this.songService.downloadFromYoutube(this.song.id).
            finally(() => {
                this.isUploading = false;
            });
    }

    searchPlaylist() {
        this.playlistService.getYoutubePlaylist(this.song.author.id, this.song.title).subscribe({
            next: (playlistId: string) => {
                if (playlistId != "") {
                    this.openPlaylistModal(playlistId);
                }
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

    openPlaylistModal(playlistId: string) {
        const modalRef = this.modalService.openComponentModal(YoutubePlaylistComponent, { playlistId: playlistId });
        modalRef.componentInstance.modalRef = modalRef;
    }
}
