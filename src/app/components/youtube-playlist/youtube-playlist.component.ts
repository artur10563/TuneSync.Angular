import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlaylistService } from '../../services/playlist.service';
import { JobService } from '../../services/job.service';
import { Router } from '@angular/router';
import { interval, switchMap, takeWhile } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-youtube-playlist',
    templateUrl: './youtube-playlist.component.html',
    styleUrls: ['./youtube-playlist.component.css']
})
export class YoutubePlaylistComponent implements OnInit {

    @Input() playlistId: string = "";
    safeUrl: SafeResourceUrl = "";
    modalRef!: NgbModalRef;

    constructor(private sanitizer: DomSanitizer,
        private playlistService: PlaylistService,
        private jobService: JobService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    isDownloading: boolean = false;

    ngOnInit(): void {
        if (this.playlistId) {
            const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${this.playlistId}`;
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        }
    }

    close() {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

    downloadPlaylist() {
        //Create playlistDownload Job, every 5 seconds get status of this job untill finished
        this.playlistService.downloadYoutubePlaylist(this.playlistId).then(jobId => {
            if (!jobId) return;

            this.isDownloading = true;

            interval(5000)
                .pipe(
                    switchMap(() => this.jobService.getJobStatus<string>(jobId)),
                    takeWhile((jobResponce) => jobResponce.jobStatus !== 'Succeeded', true)
                )
                .subscribe({
                    next: (jobResponce) => {
                        if (jobResponce.jobStatus === 'Succeeded') {

                            this.isDownloading = false;
                            this.notificationService.show('Album is ready to listen!', 'success');
                            this.close();
                            this.router.navigate(['/album', jobResponce.data])

                        } else if (jobResponce.jobStatus === 'Failed') {
                            this.isDownloading = false;
                            this.notificationService.show('Job failed', 'error');
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this.isDownloading = false;
                        this.notificationService.handleError(error);
                    }
                });
        });
    }
}
