import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { SituationMat } from './situation-mat.model';
import { SituationMatService } from './situation-mat.service';

@Component({
    selector: 'jhi-situation-mat-detail',
    templateUrl: './situation-mat-detail.component.html'
})
export class SituationMatDetailComponent implements OnInit, OnDestroy {

    situationMat: SituationMat;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private situationMatService: SituationMatService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSituationMats();
    }

    load(id) {
        this.situationMatService.find(id).subscribe((situationMat) => {
            this.situationMat = situationMat;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSituationMats() {
        this.eventSubscriber = this.eventManager.subscribe(
            'situationMatListModification',
            (response) => this.load(this.situationMat.id)
        );
    }
}
