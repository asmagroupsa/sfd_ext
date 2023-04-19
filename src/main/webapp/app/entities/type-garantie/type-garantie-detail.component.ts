import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TypeGarantie } from './type-garantie.model';
import { TypeGarantieService } from './type-garantie.service';

@Component({
    selector: 'jhi-type-garantie-detail',
    templateUrl: './type-garantie-detail.component.html'
})
export class TypeGarantieDetailComponent implements OnInit, OnDestroy {

    typeGarantie: TypeGarantie;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeGarantieService: TypeGarantieService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTypeGaranties();
    }

    load(id) {
        this.typeGarantieService.find(id).subscribe((typeGarantie) => {
            this.typeGarantie = typeGarantie;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeGaranties() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeGarantieListModification',
            (response) => this.load(this.typeGarantie.id)
        );
    }
}
