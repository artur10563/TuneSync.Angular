import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Roles } from '../../../shared/enums/roles.enum';
import { AuthService } from '../../../core/services/auth.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    searchQuery: string = '';

    constructor(
        public readonly authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }
    roles = Roles;

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['query']) {
                this.searchQuery = params['query'];
            }
        });
    }

    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated;
    }

    performSearch(event: Event) {
        event.preventDefault();
        this.router.navigate(['/search'], {
            queryParams: { query: this.searchQuery },
            queryParamsHandling: 'merge'
        });
    }

    navigateToLogin() {
        this.router.navigate(['/auth']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

    adminButtons = [
        {
            label: 'Artist Management',
            icon: 'bi bi-person-video2',
            items: [
                {
                    label: 'Merge Artists',
                    icon: 'bi bi-diagram-3',
                    command: () => this.router.navigate(['/admin/artist/merge'])
                }
            ],
            command: () => console.log("Artist management will be here")
        },
        {
            label: 'Song Management',
            icon: 'bi bi-music-note',
            command: () => this.router.navigate(['/admin/song/failed'])
        },
    ];

}