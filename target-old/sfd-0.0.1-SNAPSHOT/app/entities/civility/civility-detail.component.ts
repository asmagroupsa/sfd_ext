import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Civility } from './civility.model';
import { CivilityService } from './civility.service';

@Component({
    selector: 'jhi-civility-detail',
    templateUrl: './civility-detail.component.html'
})
export class CivilityDetailComponent implements OnInit, OnDestroy {

    civility: Civility;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private civilityService: CivilityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCivilities();
    }

    load(id) {
        this.civilityService.find(id).subscribe((civility) => {
            this.civility = civility;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCivilities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'civilityListModification',
            (response) => this.load(this.civility.id)
        );
    }
}
