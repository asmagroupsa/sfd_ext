import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { RequestRaison } from './request-raison.model';
import { RequestRaisonService } from './request-raison.service';

@Component({
    selector: 'jhi-request-raison-detail',
    templateUrl: './request-raison-detail.component.html'
})
export class RequestRaisonDetailComponent implements OnInit, OnDestroy {

    requestRaison: RequestRaison;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private requestRaisonService: RequestRaisonService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRequestRaisons();
    }

    load(id) {
        this.requestRaisonService.find(id).subscribe((requestRaison) => {
            this.requestRaison = requestRaison;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRequestRaisons() {
        this.eventSubscriber = this.eventManager.subscribe(
            'requestRaisonListModification',
            (response) => this.load(this.requestRaison.id)
        );
    }
}
