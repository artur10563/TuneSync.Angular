import { Component, Input } from '@angular/core';
import { MixService } from '../../../core/services/mix.service';
import { ArtistWithCounts } from '../../../models/Artist/Artist.model';


@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.css'
})
export class ArtistCardComponent {
    constructor(
        public readonly mixService: MixService
    ) { }

    @Input() artist!: ArtistWithCounts;
}
