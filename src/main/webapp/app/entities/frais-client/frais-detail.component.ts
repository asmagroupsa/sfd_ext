import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Frais } from './frais.model';
import { FraisService } from './frais.service';

@Component({
    selector: 'jhi-frais-detail',
    templateUrl: './frais-detail.component.html'
})
export class FraisDetailComponent implements OnInit, OnDestroy {

    frais: Frais;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private fraisService: FraisService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFrais();
    }

    load(id) {
        this.fraisService.find(id).subscribe((frais) => {
            this.frais = frais;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFrais() {
        this.eventSubscriber = this.eventManager.subscribe(
            'fraisListModification',
            (response) => this.load(this.frais.id)
        );
    }
}
