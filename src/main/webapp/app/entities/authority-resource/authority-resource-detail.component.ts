import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { AuthorityResource } from './authority-resource.model';
import { AuthorityResourceService } from './authority-resource.service';

@Component({
    selector: 'jhi-authority-resource-detail',
    templateUrl: './authority-resource-detail.component.html'
})
export class AuthorityResourceDetailComponent implements OnInit, OnDestroy {

    authorityResource: AuthorityResource;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private authorityResourceService: AuthorityResourceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAuthorityResources();
    }

    load(id) {
        this.authorityResourceService.find(id).subscribe((authorityResource) => {
            this.authorityResource = authorityResource;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAuthorityResources() {
        this.eventSubscriber = this.eventManager.subscribe(
            'authorityResourceListModification',
            (response) => this.load(this.authorityResource.id)
        );
    }
}
