import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { TypeMembre } from './type-membre.model';
import { TypeMembreService } from './type-membre.service';

@Component({
    selector: 'jhi-type-membre-detail',
    templateUrl: './type-membre-detail.component.html'
})
export class TypeMembreDetailComponent implements OnInit, OnDestroy {

    typeMembre: TypeMembre;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private typeMembreService: TypeMembreService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTypeMembres();
    }

    load(id) {
        this.typeMembreService.find(id).subscribe((typeMembre) => {
            this.typeMembre = typeMembre;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTypeMembres() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeMembreListModification',
            (response) => this.load(this.typeMembre.id)
        );
    }
}
