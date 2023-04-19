import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ProduitTypeGarantie } from './produit-type-garantie.model';
import { ProduitTypeGarantieService } from './produit-type-garantie.service';

@Component({
    selector: 'jhi-tranche-penal-detail',
    templateUrl: './tranche-penal-detail.component.html'
})
export class TranchePenalDetailComponent implements OnInit, OnDestroy {

    tranchePenal: ProduitTypeGarantie;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tranchePenalService: ProduitTypeGarantieService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTranchePenals();
    }

    load(id) {
        this.tranchePenalService.find(id).subscribe((tranchePenal) => {
            this.tranchePenal = tranchePenal;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTranchePenals() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tranchePenalListModification',
            (response) => this.load(this.tranchePenal.id)
        );
    }
}
