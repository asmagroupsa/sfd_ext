import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Affectation } from './affectation.model';
import { AffectationService } from './affectation.service';

@Component({
    selector: 'jhi-affectation-detail',
    templateUrl: './affectation-detail.component.html'
})
export class AffectationDetailComponent implements OnInit, OnDestroy {

    affectation: Affectation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private affectationService: AffectationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAffectation();
    }

    load(id) {
        this.affectationService.find(id).subscribe((affectation) => {
            this.affectation = affectation;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAffectation() {
        this.eventSubscriber = this.eventManager.subscribe(
            'AffectationListModification',
            (response) => this.load(this.affectation.id)
        );
    }
}
