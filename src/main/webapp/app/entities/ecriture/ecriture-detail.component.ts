import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Ecriture } from './ecriture.model';
import { EcritureService } from './ecriture.service';

@Component({
    selector: 'jhi-ecriture-detail',
    templateUrl: './ecriture-detail.component.html'
})
export class EcritureDetailComponent implements OnInit, OnDestroy {

    ecriture: Ecriture;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private ecritureService: EcritureService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEcritures();
    }

    load(id) {
        this.ecritureService.find(id).subscribe((ecriture) => {
            this.ecriture = ecriture;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEcritures() {
        this.eventSubscriber = this.eventManager.subscribe(
            'ecritureListModification',
            (response) => this.load(this.ecriture.id)
        );
    }
}
