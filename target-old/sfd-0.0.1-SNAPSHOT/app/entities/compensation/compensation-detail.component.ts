import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Compensation } from './compensation.model';
import { CompensationService } from './compensation.service';

@Component({
    selector: 'jhi-compensation-detail',
    templateUrl: './compensation-detail.component.html'
})
export class CompensationDetailComponent implements OnInit, OnDestroy {

    compensation: Compensation;
    ordre:any;
    params:any = {};
    private subscription: Subscription;
    private eventSubscriber: Subscription;
type:any;
    constructor(
        private eventManager: JhiEventManager,
        private compensationService: CompensationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.params = params;
            this.load(params['id']);
        });
        this.registerChangeInCompensations();
    }

    load(id) {
        this.type = this.route.snapshot.queryParams['type'];
        if(/compensation/i.test(this.type)){
        this.compensationService.detailCompensation(this.params['id'],this.params['type']).subscribe((compensation) => {
            this.compensation = compensation;
        });
        }else if(/ordre/i.test(this.type)){
        this.compensationService.detailOrdreVirement(this.params['id'],this.params['type']).subscribe((ordre) => {
            //this.ordre = ordre;
            this.compensation = ordre;
        });
        }
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCompensations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'compensationListModification',
            (response) => this.load(this.compensation.id)
        );
    }
}
