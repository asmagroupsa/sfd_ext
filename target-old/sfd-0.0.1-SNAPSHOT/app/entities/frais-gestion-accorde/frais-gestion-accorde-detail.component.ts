import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { FraisGestionAccorde } from './frais-gestion-accorde.model';
import { FraisGestionAccordeService } from './frais-gestion-accorde.service';

@Component({
    selector: 'jhi-frais-gestion-accorde-detail',
    templateUrl: './frais-gestion-accorde-detail.component.html'
})
export class FraisGestionAccordeDetailComponent implements OnInit, OnDestroy {

    fraisGestionAccorde: FraisGestionAccorde;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private fraisGestionAccordeService: FraisGestionAccordeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFraisGestionAccordes();
    }

    load(id) {
        this.fraisGestionAccordeService.find(id).subscribe((fraisGestionAccorde) => {
            this.fraisGestionAccorde = fraisGestionAccorde;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFraisGestionAccordes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'fraisGestionAccordeListModification',
            (response) => this.load(this.fraisGestionAccorde.id)
        );
    }
}
