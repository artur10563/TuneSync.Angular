import { Component, OnInit } from '@angular/core';
import { ArtistWithCounts } from '../../models/Artist/Artist.model';
import { ArtistService } from '../../services/artist.service';
import { NotificationService } from '../../services/notification.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MixService } from '../../services/mix.service';
import { ArtistSummary } from '../../models/Artist/ArtistSummary.mode';

@Component({
    selector: 'app-artist-search',
    templateUrl: './artist-search.component.html',
    styleUrl: './artist-search.component.css'
})
export class ArtistSearchComponent implements OnInit {
    searchQuery: string = '';
    artists: ArtistWithCounts[] = [];

    page: number = 1;
    totalPages: number = 1;
    isLoading: boolean = false;
    isScrollingDisabled: boolean = false;


    private filterSubject: Subject<string> = new Subject<string>();

    constructor(
        private artistService: ArtistService,
        private notificationService: NotificationService,
        private mixService: MixService) { }

    ngOnInit(): void {
        this.fetchArtists();

        this.filterSubject
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                this.handleSearch();
            });
    }

    fetchArtists() {
        if (this.page > this.totalPages || this.isLoading) {
            this.isScrollingDisabled = true;
            return;
        }

        this.isLoading = true;

        this.artistService.getArtistsPage(this.searchQuery, true, this.page).subscribe({
            next: (response) => {
                this.artists = [...this.artists, ...response.items];

                this.page = response.pageInfo.page + 1;
                this.totalPages = response.pageInfo.totalPages;
            },
            error: (err) => {
                this.notificationService.handleError(err);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    handleSearch() {
        this.artists = [];
        this.page = 1;
        this.totalPages = 1;
        this.fetchArtists();
    }

    onFilterChange(): void {
        this.filterSubject.next(this.searchQuery);
    }

    mixFiltered(): void {
        if (this.artists.length === 0) {
            return;
        }

        this.artists.forEach(artist => {
            this.mixService.addItemToSelection(artist);
        });

        this.mixService.startMix();
    }
}
