import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Departement } from './departement.model';
import { DepartementService } from './departement.service';

@Component({
    selector: 'jhi-departement-detail',
    templateUrl: './departement-detail.component.html'
})
export class DepartementDetailComponent implements OnInit, OnDestroy {

    departement: Departement;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private departementService: DepartementService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDepartements();
    }

    load(id) {
        this.departementService.find(id).subscribe((departement) => {
            this.departement = departement;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDepartements() {
        this.eventSubscriber = this.eventManager.subscribe(
            'departementListModification',
            (response) => this.load(this.departement.id)
        );
    }
}
