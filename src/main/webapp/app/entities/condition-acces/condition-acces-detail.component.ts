import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ConditionAcces } from './condition-acces.model';
import { ConditionAccesService } from './condition-acces.service';

@Component({
    selector: 'jhi-condition-acces-detail',
    templateUrl: './condition-acces-detail.component.html'
})
export class ConditionAccesDetailComponent implements OnInit, OnDestroy {

    conditionAcces: ConditionAcces;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private conditionAccesService: ConditionAccesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInConditionAcces();
    }

    load(id) {
        this.conditionAccesService.find(id).subscribe((conditionAcces) => {
            this.conditionAcces = conditionAcces;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInConditionAcces() {
        this.eventSubscriber = this.eventManager.subscribe(
            'conditionAccesListModification',
            (response) => this.load(this.conditionAcces.id)
        );
    }
}
