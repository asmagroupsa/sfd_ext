import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { EventBus } from './functions';
import { LOCAL_FLAG, enableResourcesControl } from './request-util';
import { UserData } from './singleton';

@Directive({
    selector: '[jhiHasAnyRessources]'
})
export class HasAnyRessourcesDirective {
    constructor(
        private principal: Principal,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef
    ) { }

    @Input()
    set jhiHasAnyRessources(value: string | string[]) {
        if (!enableResourcesControl) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            return;
        }
        /* if (!value) {
            //this.viewContainerRef.clear();
            return;
        } */
        this.updateView(value);
        // Get notified each time authentication state changes.
        EventBus.subscribe('ressources', () => this.updateView(value));
        EventBus.subscribe('agences', () => this.updateView(value));
    }

    private updateView(value: string | string[]): void {
        let ressources = UserData.getInstance().ressources;
        // if (Array.isArray(value) && value[0] && value.length == 1) {
        //     this.viewContainerRef.clear();
        //     let index = -1;
        //     for (let item of value) {
        //         item = item ? item.trim() : item;
        //         if (ressources.indexOf(item) != -1) index = 1;
        //     }
        //     // if (LOCAL_FLAG && index != -1)
        //     if (index != -1)
        //         this.viewContainerRef.createEmbeddedView(this.templateRef);
        //     return;
        // }
        value = Array.isArray(value) ? value : [value];
        this.viewContainerRef.clear();
        let index = -1;
        for (let item of value) {
            item = item ? item.trim() : item;
            if (ressources.indexOf(item) != -1) index = 1;
        }
        if (!value[0]) index = 1;
        if (index != -1) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
    }
}
