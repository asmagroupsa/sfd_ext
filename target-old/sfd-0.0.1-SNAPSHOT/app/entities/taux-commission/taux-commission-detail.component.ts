import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TauxCommission } from './taux-commission.model';
import { TauxCommissionService } from './taux-commission.service';

@Component({
    selector: 'jhi-taux-commission-detail',
    templateUrl: './taux-commission-detail.component.html'
})
export class TauxCommissionDetailComponent implements OnInit, OnDestroy {

    tauxCommission: TauxCommission;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tauxCommissionService: TauxCommissionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTauxCommissions();
    }

    load(id) {
        this.tauxCommissionService.find(id).subscribe((tauxCommission) => {
            this.tauxCommission = tauxCommission;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTauxCommissions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tauxCommissionListModification',
            (response) => this.load(this.tauxCommission.id)
        );
    }
}
