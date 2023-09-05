import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Contrat } from './contrat.model';
import { ContratService } from './contrat.service';

@Component({
    selector: 'jhi-contrat-detail',
    templateUrl: './contrat-detail.component.html'
})
export class ContratDetailComponent implements OnInit, OnDestroy {

    contrat: Contrat;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private contratService: ContratService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInContrats();
    }

    load(id) {
        this.contratService.find(id).subscribe((contrat) => {
            this.contrat = contrat;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInContrats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'contratListModification',
            (response) => this.load(this.contrat.id)
        );
    }
}
