import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { LigneRequest } from './ligne-request.model';
import { LigneRequestService } from './ligne-request.service';

@Component({
    selector: 'jhi-ligne-request-detail',
    templateUrl: './ligne-request-detail.component.html'
})
export class LigneRequestDetailComponent implements OnInit, OnDestroy {

    ligneRequest: LigneRequest;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private ligneRequestService: LigneRequestService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLigneRequests();
    }

    load(id) {
        this.ligneRequestService.find(id).subscribe((ligneRequest) => {
            this.ligneRequest = ligneRequest;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLigneRequests() {
        this.eventSubscriber = this.eventManager.subscribe(
            'ligneRequestListModification',
            (response) => this.load(this.ligneRequest.id)
        );
    }
}
