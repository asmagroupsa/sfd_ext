import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { OperationCaisse } from './operation-caisse.model';
import { OperationCaisseService } from './operation-caisse.service';

@Component({
    selector: 'jhi-operation-caisse-type-detail',
    templateUrl: './operation-caisse-detail.component.html'
})
export class OperationCaisseDetailComponent implements OnInit, OnDestroy {

    OperationCaisse: OperationCaisse;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private OperationCaisseService: OperationCaisseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInOperationCaisses();
    }

    load(id) {
        this.OperationCaisseService.find(id).subscribe((OperationCaisse) => {
            this.OperationCaisse = OperationCaisse;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInOperationCaisses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'OperationCaisseListModification',
            (response) => this.load(this.OperationCaisse.id)
        );
    }
}
