import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Periodicity } from './periodicity.model';
import { PeriodicityService } from './periodicity.service';

@Component({
    selector: 'jhi-periodicity-detail',
    templateUrl: './periodicity-detail.component.html'
})
export class PeriodicityDetailComponent implements OnInit, OnDestroy {

    periodicity: Periodicity;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private periodicityService: PeriodicityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPeriodicities();
    }

    load(id) {
        this.periodicityService.find(id).subscribe((periodicity) => {
            this.periodicity = periodicity;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPeriodicities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'periodicityListModification',
            (response) => this.load(this.periodicity.id)
        );
    }
}
