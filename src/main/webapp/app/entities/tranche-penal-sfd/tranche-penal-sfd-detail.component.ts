import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TranchePenalSFD } from './tranche-penal-sfd.model';
import { TranchePenalSFDService } from './tranche-penal-sfd.service';

@Component({
    selector: 'jhi-tranche-penal-sfd-detail',
    templateUrl: './tranche-penal-sfd-detail.component.html'
})
export class TranchePenalSFDDetailComponent implements OnInit, OnDestroy {

    tranchePenalSFD: TranchePenalSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tranchePenalSFDService: TranchePenalSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTranchePenalSFDS();
    }

    load(id) {
        this.tranchePenalSFDService.find(id).subscribe((tranchePenalSFD) => {
            this.tranchePenalSFD = tranchePenalSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTranchePenalSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tranchePenalSFDListModification',
            (response) => this.load(this.tranchePenalSFD.id)
        );
    }
}
