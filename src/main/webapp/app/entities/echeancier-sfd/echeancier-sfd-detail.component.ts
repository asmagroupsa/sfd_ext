import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { EcheancierSFD } from './echeancier-sfd.model';
import { EcheancierSFDService } from './echeancier-sfd.service';

@Component({
    selector: 'jhi-echeancier-sfd-detail',
    templateUrl: './echeancier-sfd-detail.component.html'
})
export class EcheancierSFDDetailComponent implements OnInit, OnDestroy {

    echeancierSFD: EcheancierSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private echeancierSFDService: EcheancierSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEcheancierSFDS();
    }

    load(id) {
        this.echeancierSFDService.find(id).subscribe((echeancierSFD) => {
            this.echeancierSFD = echeancierSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEcheancierSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'echeancierSFDListModification',
            (response) => this.load(this.echeancierSFD.id)
        );
    }
}
