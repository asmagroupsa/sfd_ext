import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ConditionGarantie } from './condition-garantie.model';
import { ConditionGarantieService } from './condition-garantie.service';

@Component({
    selector: 'jhi-condition-garantie-detail',
    templateUrl: './condition-garantie-detail.component.html'
})
export class ConditionGarantieDetailComponent implements OnInit, OnDestroy {

    conditionGarantie: ConditionGarantie;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private conditionGarantieService: ConditionGarantieService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInConditionGaranties();
    }

    load(id) {
        this.conditionGarantieService.find(id).subscribe((conditionGarantie) => {
            this.conditionGarantie = conditionGarantie;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInConditionGaranties() {
        this.eventSubscriber = this.eventManager.subscribe(
            'conditionGarantieListModification',
            (response) => this.load(this.conditionGarantie.id)
        );
    }
}
