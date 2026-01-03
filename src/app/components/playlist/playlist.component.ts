import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { AlbumService } from '../../services/album.service';
import { Playlist } from '../../models/Playlist/Playlist.model';
import { Album, extractAlbumId } from '../../models/Album/Album.mode';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { MixService } from '../../services/mix.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { AudioService } from '../../services/audio.service';
import { interval, switchMap, takeWhile } from 'rxjs';
import { JobService } from '../../services/job.service';
import { Roles } from '../../enums/roles.enum';
import { SongSource } from '../../services/song-sources/song-source.interface';
import { AlbumSongSource, PlaylistSongSource } from '../../services/song-sources/album-song-source';
import { SafeBrowserService } from '../../services/safe-storage.service';
import { SeoService } from '../../services/seo.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    type = "";
    isDownloading: boolean = false;
    @Input() playlist: Playlist | Album | null = null;

    constructor(
        private route: ActivatedRoute,
        private playlistService: PlaylistService,
        private albumService: AlbumService,
        private modalService: ModalService,
        private router: Router,
        private notificationService: NotificationService,
        private mixService: MixService,
        private audioService: AudioService,
        private jobService: JobService,
        private cdRef: ChangeDetectorRef,
        private safeBrowserService: SafeBrowserService,
        private seoService: SeoService
    ) { }

    roles = Roles;
    protected songSource!: SongSource;


    ngOnInit(): void {
        this.type = this.route.snapshot.data['type'];
        this.playlist = this.route.snapshot.data['playlist'];

        if (this.playlist) {
            this.initSeo();

            const guid = (this.playlist as Playlist | Album).guid;
            this.songSource = this.type === 'playlist'
                ? new PlaylistSongSource(this.playlistService, guid)
                : new AlbumSongSource(this.albumService, guid);

            this.fetchData(guid);
        }
    }

    /** Initialize SEO meta tags */
    private initSeo(): void {
        if (!this.playlist) return;

        if (this.type === 'playlist') {
            this.seoService.setPlaylistSeoData({
                tracksCount: (this.playlist as Playlist).songCount,
                creator: (this.playlist as Playlist).createdByName
            });
            this.seoService.setSeoData({
                title: this.playlist.title,
                description: `Listen to ${this.playlist.title} on TuneSync.`,
                ogImage: { url: this.playlist.thumbnailUrl || '', alt: this.playlist.title },
                ogType: 'music.playlist'
            });
        } else {
            this.seoService.setAlbumSeoData({
                tracksCount: (this.playlist as Album).songCount,
                musician: (this.playlist as Album).artist?.guid || ''
            });
            this.seoService.setSeoData({
                title: this.playlist.title,
                description: `Listen to ${this.playlist.title} on TuneSync.`,
                ogImage: { url: this.playlist.thumbnailUrl || '', alt: this.playlist.title },
                ogType: 'music.album'
            });
        }
    }

    fetchData(guid: string): void {
        if (!this.songSource) {
            this.notificationService.show('Song source is not initialized', 'error');
            return;
        }
        this.songSource.loadInitial().subscribe();
    }

    //TODO: Add infini-scroll. Example of infini-scroll can be found in All artists list
    loadNextPage(): void {
        const guid = this.route.snapshot.paramMap.get('guid');
        if (guid == null || this.playlist == null) return;

        if (this.songSource?.hasNextPage()) {
            this.songSource.loadNextPage().subscribe();
        }
    }

    toggleFavorite(playlist: Playlist | null) {
        if (!playlist) return;
        if (this.isAlbum(playlist)) this.albumService.toggleFavorite(playlist);
        else this.playlistService.toggleFavorite(playlist);
    }

    isAlbum(playlist: Playlist | Album): playlist is Album {
        return (playlist as Album).artist !== undefined;
    }

    openDeletePlaylistModal(modalContent: TemplateRef<any>) {
        this.modalService.openModalFromTemplate(modalContent).then(result => {
            if (result === 'Yes') this.deletePlaylist();
        });
    }

    deletePlaylist() {
        if (!this.playlist) return;

        const serviceCall = this.type === 'album'
            ? this.albumService.deleteAlbum(this.playlist.guid)
            : this.playlistService.deletePlaylist(this.playlist.guid);

        serviceCall.subscribe({
            next: () => {
                this.router.navigate(['/']);
                this.notificationService.show(`${this.type === 'album' ? 'Album' : 'Playlist'} deleted successfully!`, 'success');
            },
            error: (err) => this.notificationService.handleError(err)
        });
    }

    addToMix(playlist: Playlist | Album) {
        this.type === "album"
            ? this.mixService.addItemToSelection(playlist as AlbumSummary)
            : this.mixService.addItemToSelection(playlist as PlaylistSummary);
    }

    play() {
        if (this.songSource) this.audioService.setCurrentSongSource(this.songSource);
    }

    downloadMissingSongs(album: Album) {
        const sourceId = extractAlbumId(album.sourceUrl);
        if (!sourceId) return;

        this.playlistService.downloadYoutubePlaylist(sourceId).then(jobId => {
            if (!jobId) return;

            this.isDownloading = true;
            interval(5000)
                .pipe(
                    switchMap(() => this.jobService.getJobStatus<string>(jobId)),
                    takeWhile(jobResponse => jobResponse.jobStatus !== 'Succeeded' && jobResponse.jobStatus !== 'Failed', true)
                )
                .subscribe({
                    next: jobResponse => {
                        if (jobResponse.jobStatus === 'Succeeded') {
                            this.notificationService.show('Missing songs have been added successfully!', 'success');
                            if (this.safeBrowserService.isBrowserPlatform) window.location.reload();
                            this.isDownloading = false;
                        } else if (jobResponse.jobStatus === 'Failed') {
                            this.notificationService.show('Failed to download missing songs', 'error');
                            this.isDownloading = false;
                        }
                    },
                    error: error => {
                        this.isDownloading = false;
                        this.notificationService.handleError(error);
                    }
                });
        });
    }
}
