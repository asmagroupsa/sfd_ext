import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OperationComptable } from './operation-comptable.model';
import { OperationComptableService } from './operation-comptable.service';

@Component({
    selector: 'jhi-operation-comptable-detail',
    templateUrl: './operation-comptable-detail.component.html'
})
export class OperationComptableDetailComponent implements OnInit, OnDestroy {

    operationComptable: OperationComptable;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private operationComptableService: OperationComptableService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOperationComptables();
    }

    load(id) {
        this.operationComptableService.find(id).subscribe((operationComptable) => {
            this.operationComptable = operationComptable;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOperationComptables() {
        this.eventSubscriber = this.eventManager.subscribe(
            'operationComptableListModification',
            (response) => this.load(this.operationComptable.id)
        );
    }
}
