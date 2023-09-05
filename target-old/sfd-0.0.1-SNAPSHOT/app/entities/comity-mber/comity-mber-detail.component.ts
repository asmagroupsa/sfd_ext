import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ComityMber } from './comity-mber.model';
import { ComityMberService } from './comity-mber.service';

@Component({
    selector: 'jhi-comity-mber-detail',
    templateUrl: './comity-mber-detail.component.html'
})
export class ComityMberDetailComponent implements OnInit, OnDestroy {

    comityMber: ComityMber;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private comityMberService: ComityMberService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInComityMbers();
    }

    load(id) {
        this.comityMberService.find(id).subscribe((comityMber) => {
            this.comityMber = comityMber;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInComityMbers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'comityMberListModification',
            (response) => this.load(this.comityMber.id)
        );
    }
}
