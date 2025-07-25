import { Component, TemplateRef } from '@angular/core';
import { ArtistSummary } from '../../models/Artist/ArtistSummary.mode';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Roles } from '../../enums/roles.enum';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { MixService } from '../../services/mix.service';
import { SongSource } from '../../services/song-sources/song-source.interface';
import { ArtistSongSource } from '../../services/song-sources/artist-song-source';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrl: './artist.component.css'
})
export class ArtistComponent {
    artistSummary: ArtistSummary | null = null;
    roles = Roles;
    constructor(
        private route: ActivatedRoute,
        private artistService: ArtistService,
        private router: Router,
        private modalService: ModalService,
        private notificationService: NotificationService,
        public readonly mixService : MixService) { }

    loading: boolean = true;
    protected songSource!: SongSource;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            if (guid) {
                this.songSource = new ArtistSongSource(this.artistService, guid);

                this.artistService.getArtistSummary(guid).subscribe(artistSummary => {
                    this.artistSummary = artistSummary;
                    this.loading = false;
                    this.songSource.cachedSongs = artistSummary.songs;
                });
            }
        });
    }

    openDeleteArtistModal(modalContent: TemplateRef<any>) {
        this.modalService.openModalFromTemplate(modalContent).then(
            (result) => {
                if (result === 'Yes') {
                    this.deleteArtist();
                }
            },
            (reason) => {
            }
        );
    }

    deleteArtist() {
        if (this.artistSummary) {
            this.artistService.deleteArtist(this.artistSummary.artistInfo.guid).subscribe({
                next: (result) => {
                    if (result) {
                        this.router.navigate(["/"]);
                        this.notificationService.show(`Artist deleted successfully!`, 'success');
                    }
                },
                error: (err) => {
                    this.notificationService.handleError(err);
                }
            });
        }
    }
}
