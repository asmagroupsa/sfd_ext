import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { DelegationComity } from './delegation-comity.model';
import { DelegationComityService } from './delegation-comity.service';

@Component({
    selector: 'jhi-delegation-comity-detail',
    templateUrl: './delegation-comity-detail.component.html'
})
export class DelegationComityDetailComponent implements OnInit, OnDestroy {

    delegationComity: DelegationComity;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private delegationComityService: DelegationComityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDelegationComities();
    }

    load(id) {
        this.delegationComityService.find(id).subscribe((delegationComity) => {
            this.delegationComity = delegationComity;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDelegationComities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'delegationComityListModification',
            (response) => this.load(this.delegationComity.id)
        );
    }
}
