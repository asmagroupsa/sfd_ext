import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TypesContrat } from './types-contrat.model';
import { TypesContratService } from './types-contrat.service';

@Component({
    selector: 'jhi-types-contrat-detail',
    templateUrl: './types-contrat-detail.component.html'
})
export class TypesContratDetailComponent implements OnInit, OnDestroy {

    typesContrat: TypesContrat;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private fraisService: TypesContratService,
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
        this.fraisService.find(id).subscribe((typesContrat) => {
            this.typesContrat = typesContrat;
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
            (response) => this.load(this.typesContrat.id)
        );
    }
}
