import { Component } from '@angular/core';
import { Artist, ArtistWithCounts } from '../../../models/Artist/Artist.model';
import { ArtistService } from '../../../services/artist.service';
import { debounceTime, Subject } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-artist-merge',
    templateUrl: './artist-merge.component.html',
    styleUrl: './artist-merge.component.css'
})
export class ArtistMergeComponent {

    constructor(
        private readonly artistService: ArtistService,
        private readonly notificationService: NotificationService
    ) {
        this.filterParentSubject.pipe(debounceTime(500)).subscribe((filterValue) => {
            this.fetchArtists(filterValue, true);
        });

        this.filterChildSubject.pipe(debounceTime(500)).subscribe((filterValue) => {
            this.fetchArtists(filterValue, false);
        });
    }

    parentArtists: ArtistWithCounts[] = [];
    selectedParent: ArtistWithCounts | null = null;

    childArtists: ArtistWithCounts[] = [];
    selectedChild: ArtistWithCounts | null = null;

    private filterParentSubject = new Subject<string>();
    private filterChildSubject = new Subject<string>();


    onMerge() {
        this.artistService.mergeArtists(this.selectedParent!.guid, this.selectedChild!.guid).subscribe({
            next: () => {
                this.notificationService.show('Artists merged successfully!', 'success');
                this.selectedParent = null;
                this.selectedChild = null;
                this.parentArtists = [];
                this.childArtists = [];
            },
            error: (err) => {
                this.notificationService.handleError(err);
            }
        });
    }

    getArtists(filter: string, isParent: boolean) {
        if (isParent) {
            this.filterParentSubject.next(filter.trim());
        } else {
            this.filterChildSubject.next(filter.trim());
        }
    }

    private fetchArtists(filterValue: string, isParent: boolean) {
        if (filterValue === '') return;

        this.artistService.getArtistsPage(filterValue, false).subscribe((response) => {
            if (!response || !response.items) return;

            if (isParent) {
                this.parentArtists = response.items;
            } else {
                this.childArtists = response.items;
            }
        });
    }

}
