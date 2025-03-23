import { Component } from '@angular/core';
import { AlbumService } from '../../services/album.service';
import { NotificationService } from '../../services/notification.service';
import { AlbumSummary } from '../../models/Album/AlbumSummary.model';
import { PlaylistSummary } from '../../models/Playlist/PlaylistSummary.mode';
import { PlaylistService } from '../../services/playlist.service';
import { ActivatedRoute } from '@angular/router';
import { MixService } from '../../services/mix.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-favorite-albums',
    templateUrl: './favorite-albums.component.html',
    styleUrl: './favorite-albums.component.css'
})
export class FavoriteAlbumsComponent {
    albums: AlbumSummary[] | PlaylistSummary[] = [];
    filteredAlbums: AlbumSummary[] | PlaylistSummary[] = [];
    private filterSubject: Subject<string> = new Subject<string>();
    filterText: string = "";
    isAlbumView: boolean = false;

    constructor(
        private albumService: AlbumService,
        private playlistService: PlaylistService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private mixService: MixService) { }



    ngOnInit(): void {
        this.isAlbumView = this.route.snapshot.data['isAlbumView'];
        const serviceCall = this.isAlbumView
            ? this.albumService.getFavoriteAlbums()
            : this.playlistService.getFavoritePlaylists();

        serviceCall.subscribe({
            next: (result) => {
                this.albums = result;
                this.filteredAlbums = this.albums;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });

        //Filter after 300ms typing pause
        this.filterSubject
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                this.filterAlbums();
            });
    }


    filterAlbums() {
        this.filteredAlbums = this.albums.filter((album: AlbumSummary | PlaylistSummary) => {
            const matchesTitle = album.title.toLowerCase().includes(this.filterText.toLowerCase());
            const matchesArtist =
                (album as AlbumSummary).artist?.displayName.toLowerCase().includes(this.filterText.toLowerCase());

            return matchesTitle || matchesArtist;
        });
    }

    onFilterChange(): void {
        this.filterSubject.next(this.filterText);
    }

    mixFiltered() {
        this.filteredAlbums.forEach(album => {
            this.mixService.addItemToSelection(album);
        });
        this.mixService.startMix();
    }

    trackByGuid(index: number, album: AlbumSummary | PlaylistSummary): string {
        return album.guid;
    }
}
