import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    searchQuery: string = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

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
        this.router.navigate([''], {
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
}