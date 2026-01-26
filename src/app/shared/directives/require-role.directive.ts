import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Roles } from '../enums/roles.enum';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Directive({
    selector: '[appRequireRole]'
})
export class RequireRoleDirective implements OnDestroy {

    private requiredRoles: Roles[] = [];
    private sub: Subscription;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private authService: AuthService
    ) {
        this.sub = this.authService.roles$.subscribe(userRoles => {
            this.updateView(userRoles);
        });
    }

    @Input()
    set appRequireRole(roles: Roles[]) {
        this.requiredRoles = roles;
        this.updateView(this.authService.roles);
    }

    private updateView(userRoles: string[]) {
        const isAllowed = userRoles.some(r =>
            this.requiredRoles.includes(r as Roles)
        );

        this.viewContainerRef.clear();

        if (isAllowed) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}