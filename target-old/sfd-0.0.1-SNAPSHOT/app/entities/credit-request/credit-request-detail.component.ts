import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CreditRequest } from './credit-request.model';
import { CreditRequestService } from './credit-request.service';

@Component({
    selector: 'jhi-credit-request-detail',
    templateUrl: './credit-request-detail.component.html'
})
export class CreditRequestDetailComponent implements OnInit, OnDestroy {

    creditRequest: CreditRequest;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private creditRequestService: CreditRequestService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCreditRequests();
    }

    load(id) {
        this.creditRequestService.find(id).subscribe((creditRequest) => {
            this.creditRequest = creditRequest;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCreditRequests() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditRequestListModification',
            (response) => this.load(this.creditRequest.id)
        );
    }
}
