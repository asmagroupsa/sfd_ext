import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Rembt } from './rembt.model';
import { RembtService } from './rembt.service';

@Component({
    selector: 'jhi-rembt-detail',
    templateUrl: './rembt-detail.component.html'
})
export class RembtDetailComponent implements OnInit, OnDestroy {

    rembt: Rembt;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private rembtService: RembtService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRembts();
    }

    load(id) {
        this.rembtService.find(id).subscribe((rembt) => {
            this.rembt = rembt;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRembts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'rembtListModification',
            (response) => this.load(this.rembt.id)
        );
    }
}
