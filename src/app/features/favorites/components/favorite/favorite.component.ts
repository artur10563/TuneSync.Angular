import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-favorite',
    templateUrl: './favorite.component.html',
    styleUrl: './favorite.component.css'
})
export class FavoriteComponent {

    constructor(private router: Router) { }

    setActiveTab(tab: string): void {
        this.router.navigate(['/favorite', tab]);
    }

}
