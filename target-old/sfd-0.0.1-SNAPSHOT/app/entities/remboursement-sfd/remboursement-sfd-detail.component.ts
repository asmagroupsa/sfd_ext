import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { RemboursementSFD } from './remboursement-sfd.model';
import { RemboursementSFDService } from './remboursement-sfd.service';

@Component({
    selector: 'jhi-remboursement-sfd-detail',
    templateUrl: './remboursement-sfd-detail.component.html'
})
export class RemboursementSFDDetailComponent implements OnInit, OnDestroy {

    remboursementSFD: RemboursementSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private remboursementSFDService: RemboursementSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRemboursementSFDS();
    }

    load(id) {
        this.remboursementSFDService.find(id).subscribe((remboursementSFD) => {
            this.remboursementSFD = remboursementSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRemboursementSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'remboursementSFDListModification',
            (response) => this.load(this.remboursementSFD.id)
        );
    }
}
