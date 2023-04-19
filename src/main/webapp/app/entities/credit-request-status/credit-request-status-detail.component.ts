import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CreditRequestStatus } from './credit-request-status.model';
import { CreditRequestStatusService } from './credit-request-status.service';

@Component({
    selector: 'jhi-credit-request-status-detail',
    templateUrl: './credit-request-status-detail.component.html'
})
export class CreditRequestStatusDetailComponent implements OnInit, OnDestroy {

    creditRequestStatus: CreditRequestStatus;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private creditRequestStatusService: CreditRequestStatusService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCreditRequestStatuses();
    }

    load(id) {
        this.creditRequestStatusService.find(id).subscribe((creditRequestStatus) => {
            this.creditRequestStatus = creditRequestStatus;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCreditRequestStatuses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditRequestStatusListModification',
            (response) => this.load(this.creditRequestStatus.id)
        );
    }
}
