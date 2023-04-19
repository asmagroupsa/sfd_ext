import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TypeCaisse } from './type-caisse.model';
import { TypeCaisseService } from './type-caisse.service';

@Component({
    selector: 'jhi-type-caisse-detail',
    templateUrl: './type-caisse-detail.component.html'
})
export class TypeCaisseDetailComponent implements OnInit, OnDestroy {

    typeCaisse: TypeCaisse;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeCaisseService: TypeCaisseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTypeCaisses();
    }

    load(id) {
        this.typeCaisseService.find(id).subscribe((typeCaisse) => {
            this.typeCaisse = typeCaisse;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeCaisses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeCaisseListModification',
            (response) => this.load(this.typeCaisse.id)
        );
    }
}
