import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { EcheancesSFD } from './echeances-sfd.model';
import { EcheancesSFDService } from './echeances-sfd.service';

@Component({
    selector: 'jhi-echeances-sfd-detail',
    templateUrl: './echeances-sfd-detail.component.html'
})
export class EcheancesSFDDetailComponent implements OnInit, OnDestroy {

    echeancesSFD: EcheancesSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private echeancesSFDService: EcheancesSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEcheancesSFDS();
    }

    load(id) {
        this.echeancesSFDService.find(id).subscribe((echeancesSFD) => {
            this.echeancesSFD = echeancesSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEcheancesSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'echeancesSFDListModification',
            (response) => this.load(this.echeancesSFD.id)
        );
    }
}
