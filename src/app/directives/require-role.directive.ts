import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Roles } from '../enums/roles.enum';

@Directive({
    selector: '[appRequireRole]'
})
export class RequireRoleDirective {

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private authService: AuthService) { }

    private roles: Roles[] = [];
    @Input()
    set appRequireRole(roles: Roles[]) {
        this.roles = roles;
        this.updateView();
    }

    updateView() {
        let isAllowed = this.authService.roles.some(r => this.roles.includes(r as Roles));
        if (isAllowed) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
        else {
            this.viewContainerRef.clear();
        }
    }
}
