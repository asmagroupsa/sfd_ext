import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Formation } from './formation.model';
import { FormationService } from './formation.service';

@Component({
    selector: 'jhi-formation-detail',
    templateUrl: './formation-detail.component.html'
})
export class FormationDetailComponent implements OnInit, OnDestroy {

    formation: Formation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private formationService: FormationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFormations();
    }

    load(id) {
        this.formationService.find(id).subscribe((formation) => {
            this.formation = formation;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFormations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'formationListModification',
            (response) => this.load(this.formation.id)
        );
    }
}
