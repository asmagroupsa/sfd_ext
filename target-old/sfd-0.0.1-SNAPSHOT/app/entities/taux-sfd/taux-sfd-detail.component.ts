import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TauxSFD } from './taux-sfd.model';
import { TauxSFDService } from './taux-sfd.service';

@Component({
    selector: 'jhi-taux-sfd-detail',
    templateUrl: './taux-sfd-detail.component.html'
})
export class TauxSFDDetailComponent implements OnInit, OnDestroy {

    tauxSFD: TauxSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private tauxSFDService: TauxSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTauxSFDS();
    }

    load(id) {
        this.tauxSFDService.find(id).subscribe((tauxSFD) => {
            this.tauxSFD = tauxSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTauxSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tauxSFDListModification',
            (response) => this.load(this.tauxSFD.id)
        );
    }
}
