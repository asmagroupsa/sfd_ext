import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ElementCondition } from './element-condition.model';
import { ElementConditionService } from './element-condition.service';

@Component({
    selector: 'jhi-element-condition-detail',
    templateUrl: './element-condition-detail.component.html'
})
export class ElementConditionDetailComponent implements OnInit, OnDestroy {

    elementCondition: ElementCondition;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private elementConditionService: ElementConditionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInElementConditions();
    }

    load(id) {
        this.elementConditionService.find(id).subscribe((elementCondition) => {
            this.elementCondition = elementCondition;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInElementConditions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'elementConditionListModification',
            (response) => this.load(this.elementCondition.id)
        );
    }
}
