import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ClientConditionValue } from './client-condition-value.model';
import { ClientConditionValueService } from './client-condition-value.service';

@Component({
    selector: 'jhi-client-condition-value-detail',
    templateUrl: './client-condition-value-detail.component.html'
})
export class ClientConditionValueDetailComponent implements OnInit, OnDestroy {

    clientConditionValue: ClientConditionValue;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private clientConditionValueService: ClientConditionValueService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInClientConditionValues();
    }

    load(id) {
        this.clientConditionValueService.find(id).subscribe((clientConditionValue) => {
            this.clientConditionValue = clientConditionValue;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInClientConditionValues() {
        this.eventSubscriber = this.eventManager.subscribe(
            'clientConditionValueListModification',
            (response) => this.load(this.clientConditionValue.id)
        );
    }
}
