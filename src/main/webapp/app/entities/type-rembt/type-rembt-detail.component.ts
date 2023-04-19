import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TypeRembt } from './type-rembt.model';
import { TypeRembtService } from './type-rembt.service';

@Component({
    selector: 'jhi-type-rembt-detail',
    templateUrl: './type-rembt-detail.component.html'
})
export class TypeRembtDetailComponent implements OnInit, OnDestroy {

    typeRembt: TypeRembt;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeRembtService: TypeRembtService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTypeRembts();
    }

    load(id) {
        this.typeRembtService.find(id).subscribe((typeRembt) => {
            this.typeRembt = typeRembt;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeRembts() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeRembtListModification',
            (response) => this.load(this.typeRembt.id)
        );
    }
}
