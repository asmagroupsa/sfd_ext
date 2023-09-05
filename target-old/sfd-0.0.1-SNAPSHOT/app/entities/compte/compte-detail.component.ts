import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Compte } from './compte.model';
import { CompteService } from './compte.service';

@Component({
    selector: 'jhi-compte-detail',
    templateUrl: './compte-detail.component.html'
})
export class CompteDetailComponent implements OnInit, OnDestroy {

    compte: Compte;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private compteService: CompteService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInComptes();
    }

    load(id) {
        this.compteService.find(id).subscribe((compte) => {
            this.compte = compte;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInComptes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'compteListModification',
            (response) => this.load(this.compte.id)
        );
    }
}
