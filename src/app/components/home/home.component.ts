import { Component } from '@angular/core';
import { SongService } from '../../services/song.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private songService: SongService) { }

}
