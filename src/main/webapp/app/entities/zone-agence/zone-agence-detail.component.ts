import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ZoneAgence } from './zone-agence.model';
import { ZoneAgenceService } from './zone-agence.service';

@Component({
    selector: 'jhi-zone-agence-detail',
    templateUrl: './zone-agence-detail.component.html'
})
export class ZoneAgenceDetailComponent implements OnInit, OnDestroy {

    zoneAgence: ZoneAgence;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private zoneAgenceService: ZoneAgenceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInZoneAgences();
    }

    load(id) {
        this.zoneAgenceService.find(id).subscribe((zoneAgence) => {
            this.zoneAgence = zoneAgence;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInZoneAgences() {
        this.eventSubscriber = this.eventManager.subscribe(
            'zoneAgenceListModification',
            (response) => this.load(this.zoneAgence.id)
        );
    }
}
