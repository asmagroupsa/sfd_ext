import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { FraisGestion } from './frais-gestion.model';
import { FraisGestionService } from './frais-gestion.service';

@Component({
    selector: 'jhi-frais-gestion-detail',
    templateUrl: './frais-gestion-detail.component.html'
})
export class FraisGestionDetailComponent implements OnInit, OnDestroy {

    fraisGestion: FraisGestion;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private fraisGestionService: FraisGestionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFraisGestions();
    }

    load(id) {
        this.fraisGestionService.find(id).subscribe((fraisGestion) => {
            this.fraisGestion = fraisGestion;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFraisGestions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'fraisGestionListModification',
            (response) => this.load(this.fraisGestion.id)
        );
    }
}
