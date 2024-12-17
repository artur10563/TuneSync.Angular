import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { SongService } from '../../services/song.service';
import { ModalService } from '../../services/modal.service';
import { PlaylistService } from '../../services/playlist.service';
import { NotificationService } from '../../services/notification.service';
import { ModalConfig } from '../../models/modal.model';
import { YoutubePlaylistComponent } from '../youtube-playlist/youtube-playlist.component';

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

        // this.modalService.openDownloadModal(this.song.title, this.song.author.title)
        //     .then((result: { title: string, author: string }) => {
        //         this.isUploading = true;

        //         this.songService.downloadFromYoutube(this.song.id, result.title, result.author).finally(() => {
        //             this.isUploading = false;
        //         });
        //     })
        //     .catch(() => {
        //         console.log('Download cancelled');
        //     });
    }

    // @Output() playlistIdEmitter = new EventEmitter<string>();
    searchPlaylist(song: YoutubeSong) {
        this.playlistService.getYoutubePlaylist(song.author.id, song.title).subscribe({
            next: (playlistId: string) => {
                if (playlistId != "") {
                    // this.playlistIdEmitter.emit(playlistId);
                }
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }


    searchPlaylist1(song: YoutubeSong) {

        const config: ModalConfig = {
            title: 'Playlist preview',
            confirmButtonText: 'Download',
            cancelButtonText: 'Cancel',
            fields: []
        };

        this.playlistService.getYoutubePlaylist(song.author.id, song.title).subscribe({
            next: (playlistId: string) => {
                if (playlistId != "") {
                    this.modalService.openComponentModal(YoutubePlaylistComponent, { playlistId: playlistId });
                }
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }
}
