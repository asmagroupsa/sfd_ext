import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Souscription } from './souscription.model';
import { SouscriptionService } from './souscription.service';

@Component({
    selector: 'jhi-souscription-detail',
    templateUrl: './souscription-detail.component.html'
})
export class SouscriptionDetailComponent implements OnInit, OnDestroy {

    souscription: Souscription;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private souscriptionService: SouscriptionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSouscriptions();
    }

    load(id) {
        this.souscriptionService.find(id).subscribe((souscription) => {
            this.souscription = souscription;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSouscriptions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'souscriptionListModification',
            (response) => this.load(this.souscription.id)
        );
    }
}
