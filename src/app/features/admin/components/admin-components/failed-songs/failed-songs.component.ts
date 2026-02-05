import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../../core/services/notification.service';
import { extractSongId, Song } from '../../../../../models/Song/Song.model';
import { FailedSongSource } from '../../../../../services/song-sources/failed-song-source';
import { SongSource } from '../../../../../services/song-sources/song-source.interface';
import { SongService } from '../../../../../services/song.service';
import { DisplaySettings } from '../../../../../shared/components/song-table/song-table.component';
import { TableColumnComponent } from '../../../../../shared/components/song-table/table-column/table-column.component';
import { YoutubeSong } from '../../../../../models/Youtube/YoutubeSong.model';

@Component({
    selector: 'app-failed-songs',
    templateUrl: './failed-songs.component.html',
    styleUrl: './failed-songs.component.css'
})
export class FailedSongsComponent implements OnInit {

    constructor(
        private readonly songService: SongService,
        private readonly notificationService: NotificationService
    ) { }

    protected songSource!: SongSource;
    displaySettings: DisplaySettings = {
        isFavorite: false,
        menu: false,
        duration: false
    }

    ngOnInit(): void {
        this.songSource = new FailedSongSource(this.songService);
        this.songSource.loadInitial().subscribe();
        console.log(this.songSource);
    }

    previewVisible = false;
    previewData: YoutubeSong | null = null;

    openPreview(song: Song) {
        let songId = extractSongId(song.sourceUrl);
        if(songId === null) return;

        this.previewData = {
            id: songId,
            title: song.title,
            thumbnail: {
                url: song.thumbnailUrl || ''
            },
            author: {
                id: song.artist.guid,
                title: song.artist.name
            }
        };

        this.previewVisible = true;
    }

    upload(song: Song) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/mpeg'; // mp3 only

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            this.uploadFile(song.guid, file);
        };

        input.click();
    }

    private uploadFile(songGuid: string, file: File) {
        this.songService.uploadAudio(songGuid, file).subscribe({
            next: (updatedGuid) => {
                const index = this.songSource.cachedSongs.findIndex(s => s.guid === updatedGuid);

                if (index !== -1) {
                    this.songSource.cachedSongs.splice(index, 1);
                }

                this.notificationService.show('File uploaded successfully.', 'success');
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

}