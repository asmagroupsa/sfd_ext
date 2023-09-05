import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { OperationDat } from './operation-dat.model';
import { OperationDatService } from './operation-dat.service';

@Component({
    selector: 'jhi-operation-dat-type-detail',
    templateUrl: './operation-dat-detail.component.html'
})
export class OperationDatDetailComponent implements OnInit, OnDestroy {

    OperationDat: OperationDat;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private OperationDatService: OperationDatService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOperationDats();
    }

    load(id) {
        this.OperationDatService.find(id).subscribe((OperationDat) => {
            this.OperationDat = OperationDat;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOperationDats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'OperationDatListModification',
            (response) => this.load(this.OperationDat.id)
        );
    }
}
