import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { RembtPenalSFD } from './rembt-penal-sfd.model';
import { RembtPenalSFDService } from './rembt-penal-sfd.service';

@Component({
    selector: 'jhi-rembt-penal-sfd-detail',
    templateUrl: './rembt-penal-sfd-detail.component.html'
})
export class RembtPenalSFDDetailComponent implements OnInit, OnDestroy {

    rembtPenalSFD: RembtPenalSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private rembtPenalSFDService: RembtPenalSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRembtPenalSFDS();
    }

    load(id) {
        this.rembtPenalSFDService.find(id).subscribe((rembtPenalSFD) => {
            this.rembtPenalSFD = rembtPenalSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRembtPenalSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'rembtPenalSFDListModification',
            (response) => this.load(this.rembtPenalSFD.id)
        );
    }
}
