import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CompteCommission } from './compte-commission.model';
import { CompteCommissionService } from './compte-commission.service';

@Component({
    selector: 'jhi-compte-commission-detail',
    templateUrl: './compte-commission-detail.component.html'
})
export class CompteCommissionDetailComponent implements OnInit, OnDestroy {

    compteCommission: CompteCommission;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private compteCommissionService: CompteCommissionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompteCommissions();
    }

    load(id) {
        this.compteCommissionService.find(id).subscribe((compteCommission) => {
            this.compteCommission = compteCommission;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompteCommissions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'compteCommissionListModification',
            (response) => this.load(this.compteCommission.id)
        );
    }
}
