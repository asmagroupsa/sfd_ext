import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';

@Component({
    selector: 'jhi-caisse-nouvelle-detail-solde',
    templateUrl: './caisse-nouvelle-detail-solde.component.html'
})
export class CaisseNouvelleDetailSoldeComponent implements OnInit, OnDestroy {

    montant: any;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private caisseNouvelleService: CaisseNouvelleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCaisseNouvelles();
    }

    load(id) {
        this.caisseNouvelleService.soldeCaisse(id).subscribe((montant: any) => {
            this.montant = montant;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCaisseNouvelles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'caisseNouvelleListModification',
            (response) => this.load(this.montant)
        );
    }
}
