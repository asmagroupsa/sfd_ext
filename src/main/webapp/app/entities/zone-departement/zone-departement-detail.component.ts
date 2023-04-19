import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ZoneDepartement } from './zone-departement.model';
import { ZoneDepartementService } from './zone-departement.service';

@Component({
    selector: 'jhi-zone-departement-detail',
    templateUrl: './zone-departement-detail.component.html'
})
export class ZoneDepartementDetailComponent implements OnInit, OnDestroy {

    zoneDepartement: ZoneDepartement;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private zoneDepartementService: ZoneDepartementService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInZoneDepartements();
    }

    load(id) {
        this.zoneDepartementService.find(id).subscribe((zoneDepartement) => {
            this.zoneDepartement = zoneDepartement;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInZoneDepartements() {
        this.eventSubscriber = this.eventManager.subscribe(
            'zoneDepartementListModification',
            (response) => this.load(this.zoneDepartement.id)
        );
    }
}
