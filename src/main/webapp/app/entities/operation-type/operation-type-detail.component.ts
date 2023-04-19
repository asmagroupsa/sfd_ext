import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager , JhiDataUtils } from 'ng-jhipster';

import { OperationType } from './operation-type.model';
import { OperationTypeService } from './operation-type.service';

@Component({
    selector: 'jhi-operation-type-detail',
    templateUrl: './operation-type-detail.component.html'
})
export class OperationTypeDetailComponent implements OnInit, OnDestroy {

    operationType: OperationType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private operationTypeService: OperationTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOperationTypes();
    }

    load(id) {
        this.operationTypeService.find(id).subscribe((operationType) => {
            this.operationType = operationType;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOperationTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'operationTypeListModification',
            (response) => this.load(this.operationType.id)
        );
    }
}
