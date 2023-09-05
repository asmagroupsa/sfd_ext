import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { RembtPenal } from './rembt-penal.model';
import { RembtPenalService } from './rembt-penal.service';

@Component({
    selector: 'jhi-rembt-penal-detail',
    templateUrl: './rembt-penal-detail.component.html'
})
export class RembtPenalDetailComponent implements OnInit, OnDestroy {

    rembtPenal: RembtPenal;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private rembtPenalService: RembtPenalService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRembtPenals();
    }

    load(id) {
        this.rembtPenalService.find(id).subscribe((rembtPenal) => {
            this.rembtPenal = rembtPenal;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRembtPenals() {
        this.eventSubscriber = this.eventManager.subscribe(
            'rembtPenalListModification',
            (response) => this.load(this.rembtPenal.id)
        );
    }
}
