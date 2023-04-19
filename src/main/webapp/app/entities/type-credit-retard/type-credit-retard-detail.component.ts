import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TypeCreditRetard } from './type-credit-retard.model';
import { TypeCreditRetardService } from './type-credit-retard.service';

@Component({
    selector: 'jhi-type-credit-retard-detail',
    templateUrl: './type-credit-retard-detail.component.html'
})
export class TypeCreditRetardDetailComponent implements OnInit, OnDestroy {

    typeCreditRetard: TypeCreditRetard;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeCreditRetardService: TypeCreditRetardService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTypeCreditRetards();
    }

    load(id) {
        this.typeCreditRetardService.find(id).subscribe((typeCreditRetard) => {
            this.typeCreditRetard = typeCreditRetard;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeCreditRetards() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeCreditRetardListModification',
            (response) => this.load(this.typeCreditRetard.id)
        );
    }
}
