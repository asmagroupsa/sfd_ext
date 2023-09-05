import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TauxEpargne } from './taux-epargne.model';
import { TauxEpargneService } from './taux-epargne.service';

@Component({
    selector: 'jhi-taux-epargne-detail',
    templateUrl: './taux-epargne-detail.component.html'
})
export class TauxEpargneDetailComponent implements OnInit, OnDestroy {

    tauxEpargne: TauxEpargne;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tauxEpargneService: TauxEpargneService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTauxEpargnes();
    }

    load(id) {
        this.tauxEpargneService.find(id).subscribe((tauxEpargne) => {
            this.tauxEpargne = tauxEpargne;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTauxEpargnes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tauxEpargneListModification',
            (response) => this.load(this.tauxEpargne.id)
        );
    }
}
