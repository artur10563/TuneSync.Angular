import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { interval, map, switchMap, takeWhile } from 'rxjs';
import { JobService } from '../../services/job.service';
import { Roles } from '../../enums/roles.enum';
import { SongSource } from '../../services/song-sources/song-source.interface';
import { AlbumSongSource, PlaylistSongSource } from '../../services/song-sources/album-song-source';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
    playlist: Playlist | Album | null = null;
    type = "";
    isDownloading: boolean = false;

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
        private cdRef: ChangeDetectorRef
    ) { }

    roles = Roles;
    protected songSource!: SongSource;


    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            this.type = this.route.snapshot.data['type'];

            if (guid) {
                this.songSource = this.type === 'playlist'
                    ? new PlaylistSongSource(this.playlistService, guid)
                    : new AlbumSongSource(this.albumService, guid);

                this.fetchData(guid);
            }
        });
    }


    fetchData(guid: string): void {

        if (!this.songSource) {
            this.notificationService.show('Song source is not initialized', 'error');
            return;
        }


        // We still need to fetch from service cuz of playlist/album details
        const serviceCall = this.type === 'playlist'
            ? this.playlistService.getPlaylistByGuid(guid, this.songSource.pageInfo.page).pipe(map(x => ({ data: x.playlist, pageInfo: x.pageInfo })))
            : this.albumService.getAlbumByGuid(guid, this.songSource.pageInfo.page).pipe(map(x => ({ data: x.album, pageInfo: x.pageInfo })));

        serviceCall.subscribe(resp => {
            this.playlist = resp.data;
            this.songSource!.cachedSongs = resp.data.songs;
            this.cdRef.detectChanges();
        });

    }

    //TODO: Add infini-scroll. Example of infini-scroll can be found in All artists list
    loadNextPage(): void {
        const guid = this.route.snapshot.paramMap.get('guid');
        if (guid == null || this.playlist == null) return;

        if (this.songSource?.hasNextPage()) {

            this.songSource.loadNextPage().subscribe(songs => {
                this.playlist?.songs.push(...songs);
            });

        }
    }

    toggleFavorite(playlist: Playlist | null) {
        if (playlist === null) {
            return;
        }

        if (this.isAlbum(playlist)) {
            this.albumService.toggleFavorite(playlist);
        } else {
            this.playlistService.toggleFavorite(playlist);
        }
    }

    isAlbum(playlist: Playlist | Album): playlist is Album {
        return (playlist as Album).artist !== undefined;
    }

    openDeletePlaylistModal(modalContent: TemplateRef<any>) {
        this.modalService.openModalFromTemplate(modalContent).then(
            (result) => {
                if (result === 'Yes') {
                    this.deletePlaylist();
                }
            },
            (reason) => {
            }
        );
    }

    deletePlaylist() {
        if (this.playlist) {
            let serviceCall = this.type === 'album'
                ? this.albumService.deleteAlbum(this.playlist.guid)
                : this.playlistService.deletePlaylist(this.playlist.guid);

            serviceCall.subscribe({
                next: (result) => {
                    if (result) {
                        this.router.navigate(["/"]);
                        this.notificationService.show(`${this.type === 'album' ? "Album" : "Playlist"} deleted successfully!`, 'success');
                    }
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                }
            });
        }
    }

    addToMix(playlist: Playlist | Album) {
        this.type === "album"
            ? this.mixService.addItemToSelection(playlist as AlbumSummary)
            : this.mixService.addItemToSelection(playlist as PlaylistSummary);
    }

    play() {
        if (this.songSource) {
            this.audioService.setCurrentSongSource(this.songSource);
        }
    }

    downloadMissingSongs(album: Album) {
        console.log(album);
        const sourceId = extractAlbumId(album.sourceUrl);
        if (sourceId) {
            this.playlistService.downloadYoutubePlaylist(sourceId).then(jobId => {
                if (!jobId) return;
                this.isDownloading = true;
                interval(5000)
                    .pipe(
                        switchMap(() => this.jobService.getJobStatus<string>(jobId)),
                        takeWhile((jobResponse) => jobResponse.jobStatus !== 'Succeeded' && jobResponse.jobStatus !== 'Failed', true)
                    )
                    .subscribe({
                        next: (jobResponse) => {
                            if (jobResponse.jobStatus === 'Succeeded') {
                                this.notificationService.show('Missing songs have been added successfully!', 'success');
                                window.location.reload(); // TODO: REFRESH DATA WITHOUT RELOADING WHOLE PAGE
                                this.isDownloading = false;
                            } else if (jobResponse.jobStatus === 'Failed') {
                                this.notificationService.show('Failed to download missing songs', 'error');
                                this.isDownloading = false;
                            }
                        },
                        error: (error) => {
                            this.isDownloading = false;
                            this.notificationService.handleError(error);
                        }
                    });
            });
        }
    }


}
