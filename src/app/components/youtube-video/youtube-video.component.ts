import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { YoutubeSong } from '../../models/YoutubeSong.model';
import { SongService } from '../../services/song-service.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-youtube-video',
    templateUrl: './youtube-video.component.html',
    styleUrls: ['./youtube-video.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class YoutubeVideoComponent {

    @Input()
    song!: YoutubeSong;

    safeUrl: SafeUrl = "";

    public isUploading = false;

    constructor(
        private sanitizer: DomSanitizer,
        private songService: SongService,
        private modalService: ModalService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['song'] && this.song?.id) {
            this.updateSafeUrl();
        }
    }


    private updateSafeUrl(): void {
        const url = `https://www.youtube.com/embed/${this.song.id}`;
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    uploadAudio(): void {
        this.modalService.openDownloadModal(this.song.title, this.song.author.title)
            .then((result: { title: string, author: string }) => {
                this.isUploading = true;
                this.songService.downloadFromYoutube(this.song.id, result.title, result.author)
                    .subscribe({
                        next: (response) => {
                            console.log('Audio uploaded successfully!', response);
                        },
                        error: (error) => {
                            console.error('Error uploading audio:', error);
                        },
                        complete: () => {
                            this.isUploading = false;
                        },
                    });
            })
            .catch(() => {
                console.log('Download cancelled');
            });
    }
}
