import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TrancheTauxFrais } from './tranche-taux-frais.model';
import { TrancheTauxFraisService } from './tranche-taux-frais.service';

@Component({
    selector: 'jhi-tranche-taux-frais-detail',
    templateUrl: './tranche-taux-frais-detail.component.html'
})
export class TrancheTauxFraisDetailComponent implements OnInit, OnDestroy {

    trancheTauxFrais: TrancheTauxFrais;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private trancheTauxFraisService: TrancheTauxFraisService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTrancheTauxFrais();
    }

    load(id) {
        this.trancheTauxFraisService.find(id).subscribe((trancheTauxFrais) => {
            this.trancheTauxFrais = trancheTauxFrais;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTrancheTauxFrais() {
        this.eventSubscriber = this.eventManager.subscribe(
            'trancheTauxFraisListModification',
            (response) => this.load(this.trancheTauxFrais.id)
        );
    }
}
