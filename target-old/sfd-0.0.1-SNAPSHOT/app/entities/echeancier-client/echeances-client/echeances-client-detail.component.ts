import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { EcheancesClient } from './echeances-client.model';
import { EcheancesClientService } from './echeances-client.service';

@Component({
    selector: 'jhi-echeances-client-detail',
    templateUrl: './echeances-client-detail.component.html'
})
export class EcheancesClientDetailComponent implements OnInit, OnDestroy {

    echeancesClient: EcheancesClient;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private echeancesClientService: EcheancesClientService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEcheancesClients();
    }

    load(id) {
        this.echeancesClientService.find(id).subscribe((echeancesClient) => {
            this.echeancesClient = echeancesClient;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEcheancesClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'echeancesClientListModification',
            (response) => this.load(this.echeancesClient.id)
        );
    }
}
