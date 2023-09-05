import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Dossier } from './dossier.model';
import { DossierService } from './dossier.service';

@Component({
    selector: 'jhi-dossier-detail',
    templateUrl: './dossier-detail.component.html'
})
export class DossierDetailComponent implements OnInit, OnDestroy {

    dossier: Dossier;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dossierService: DossierService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDossiers();
    }

    load(id) {
        this.dossierService.find(id).subscribe((dossier) => {
            this.dossier = dossier;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDossiers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'dossierListModification',
            (response) => this.load(this.dossier.id)
        );
    }
}
