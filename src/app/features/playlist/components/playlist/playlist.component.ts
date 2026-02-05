import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, switchMap, takeWhile } from 'rxjs';
import { MixService } from '../../../../core/services/mix.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SafeBrowserService } from '../../../../core/services/safe-browser.service';
import { SeoService } from '../../../../core/services/seo.service';
import { Roles } from '../../../../shared/enums/roles.enum';
import { Album, extractAlbumId } from '../../../../models/Album/Album.mode';
import { AlbumSummary } from '../../../../models/Album/AlbumSummary.model';
import { Playlist } from '../../../../models/Playlist/Playlist.model';
import { PlaylistSummary } from '../../../../models/Playlist/PlaylistSummary.mode';
import { AlbumService } from '../../../../services/album.service';
import { AudioService } from '../../../../services/audio.service';
import { JobService } from '../../../../services/job.service';
import { ModalService } from '../../../../services/modal.service';
import { PlaylistService } from '../../../../services/playlist.service';
import { PlaylistSongSource, AlbumSongSource } from '../../../../services/song-sources/album-song-source';
import { SongSource } from '../../../../services/song-sources/song-source.interface';


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
        this.route.data.subscribe(data => {
            const playlist = data['playlist'] as Playlist | Album | null;
            if (!playlist) return;

            this.playlist = playlist;

            // Determine type
            this.type = this.route.snapshot.data['type'];
            if (!this.type && this.route.snapshot.parent) {
                const parentPath = this.route.snapshot.parent.url
                    .map(segment => segment.path)
                    .join('/');

                this.type = parentPath === 'playlist' ? 'playlist' : 'album';
            }

            this.initSeo();

            const guid = playlist.guid;

            this.songSource = this.type === 'playlist'
                ? new PlaylistSongSource(this.playlistService, guid)
                : new AlbumSongSource(this.albumService, guid);

            this.fetchData(guid);
        });
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
