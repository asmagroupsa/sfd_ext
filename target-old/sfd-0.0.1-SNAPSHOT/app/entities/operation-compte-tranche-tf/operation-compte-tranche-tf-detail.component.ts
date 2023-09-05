import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { OperationCompteTrancheTF } from './operation-compte-tranche-tf.model';
import { OperationCompteTrancheTFService } from './operation-compte-tranche-tf.service';

@Component({
    selector: 'jhi-operation-compte-tranche-tf-detail',
    templateUrl: './operation-compte-tranche-tf-detail.component.html'
})
export class OperationCompteTrancheTFDetailComponent implements OnInit, OnDestroy {

    operationCompteTrancheTF: OperationCompteTrancheTF;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private operationCompteTrancheTFService: OperationCompteTrancheTFService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOperationCompteTrancheTFS();
    }

    load(id) {
        this.operationCompteTrancheTFService.find(id).subscribe((operationCompteTrancheTF) => {
            this.operationCompteTrancheTF = operationCompteTrancheTF;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOperationCompteTrancheTFS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'operationCompteTrancheTFListModification',
            (response) => this.load(this.operationCompteTrancheTF.id)
        );
    }
}
