import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Commission } from './commission.model';
import { CommissionService } from './commission.service';

@Component({
    selector: 'jhi-commission-detail',
    templateUrl: './commission-detail.component.html'
})
export class CommissionDetailComponent implements OnInit, OnDestroy {

    commission: Commission;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private commissionService: CommissionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCommissions();
    }

    load(id) {
        this.commissionService.find(id).subscribe((commission) => {
            this.commission = commission;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCommissions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'commissionListModification',
            (response) => this.load(this.commission.id)
        );
    }
}
