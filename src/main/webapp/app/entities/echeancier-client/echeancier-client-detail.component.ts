import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { EcheancierClient } from './echeancier-client.model';
import { EcheancierClientService } from './echeancier-client.service';

@Component({
    selector: 'jhi-echeancier-client-detail',
    templateUrl: './echeancier-client-detail.component.html'
})
export class EcheancierClientDetailComponent implements OnInit, OnDestroy {

    echeancierClient: EcheancierClient;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private echeancierClientService: EcheancierClientService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEcheancierClients();
    }

    load(id) {
        this.echeancierClientService.find(id).subscribe((echeancierClient) => {
            this.echeancierClient = echeancierClient;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEcheancierClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'echeancierClientListModification',
            (response) => this.load(this.echeancierClient.id)
        );
    }
}
