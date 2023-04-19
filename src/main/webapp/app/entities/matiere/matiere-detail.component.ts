import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Matiere } from './matiere.model';
import { MatiereService } from './matiere.service';

@Component({
    selector: 'jhi-matiere-detail',
    templateUrl: './matiere-detail.component.html'
})
export class MatiereDetailComponent implements OnInit, OnDestroy {

    matiere: Matiere;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private matiereService: MatiereService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMatieres();
    }

    load(id) {
        this.matiereService.find(id).subscribe((matiere) => {
            this.matiere = matiere;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMatieres() {
        this.eventSubscriber = this.eventManager.subscribe(
            'matiereListModification',
            (response) => this.load(this.matiere.id)
        );
    }
}
