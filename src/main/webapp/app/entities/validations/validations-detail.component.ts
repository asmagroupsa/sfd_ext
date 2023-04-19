import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { Unity } from './validations.model';
import { UnityService } from './validations.service';

@Component({
    selector: 'jhi-validations-detail',
    templateUrl: './validations-detail.component.html'
})
export class UnityDetailComponent implements OnInit, OnDestroy {

    unity: Unity;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private unityService: UnityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInUnities();
    }

    load(id) {
        this.unityService.find(id).subscribe((unity) => {
            this.unity = unity;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInUnities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'unityListModification',
            (response) => this.load(this.unity.id)
        );
    }
}
