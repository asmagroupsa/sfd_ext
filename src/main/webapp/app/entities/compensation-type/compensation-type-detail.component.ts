import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CompensationType } from './compensation-type.model';
import { CompensationTypeService } from './compensation-type.service';

@Component({
    selector: 'jhi-compensation-type-detail',
    templateUrl: './compensation-type-detail.component.html'
})
export class CompensationTypeDetailComponent implements OnInit, OnDestroy {

    compensationType: CompensationType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private compensationTypeService: CompensationTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCompensationTypes();
    }

    load(id) {
        this.compensationTypeService.find(id).subscribe((compensationType) => {
            this.compensationType = compensationType;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompensationTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'compensationTypeListModification',
            (response) => this.load(this.compensationType.id)
        );
    }
}
