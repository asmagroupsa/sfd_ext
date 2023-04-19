import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { IdCardType } from './id-card-type.model';
import { IdCardTypeService } from './id-card-type.service';

@Component({
    selector: 'jhi-id-card-type-detail',
    templateUrl: './id-card-type-detail.component.html'
})
export class IdCardTypeDetailComponent implements OnInit, OnDestroy {

    idCardType: IdCardType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private idCardTypeService: IdCardTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInIdCardTypes();
    }

    load(id) {
        this.idCardTypeService.find(id).subscribe((idCardType) => {
            this.idCardType = idCardType;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInIdCardTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'idCardTypeListModification',
            (response) => this.load(this.idCardType.id)
        );
    }
}
