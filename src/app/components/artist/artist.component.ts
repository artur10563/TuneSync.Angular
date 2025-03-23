import { Component } from '@angular/core';
import { ArtistSummary } from '../../models/Artist/ArtistSummary.mode';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrl: './artist.component.css'
})
export class ArtistComponent {
    artistSummary: ArtistSummary | null = null;

    constructor(private route: ActivatedRoute, private artistService: ArtistService, private router: Router) { }

    loading: boolean = true;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const guid = params.get('guid');
            if (guid) {
                this.artistService.getArtistSummary(guid).subscribe(artistSummary => {
                    this.artistSummary = artistSummary;
                    this.loading = false;
                });
            }
        });
    }
}
