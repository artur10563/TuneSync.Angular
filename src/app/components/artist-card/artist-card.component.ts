import { Component, Input } from '@angular/core';
import { MixService } from '../../services/mix.service';
import { Artist, ArtistWithCounts } from '../../models/Artist/Artist.model';

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
