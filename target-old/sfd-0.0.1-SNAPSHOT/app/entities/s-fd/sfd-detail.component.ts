import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { SFD } from './sfd.model';
import { SFDService } from './sfd.service';

@Component({
    selector: 'jhi-sfd-detail',
    templateUrl: './sfd-detail.component.html'
})
export class SFDDetailComponent implements OnInit, OnDestroy {

    sFD: SFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sFDService: SFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSFDS();
    }

    load(id) {
        this.sFDService.find(id).subscribe((sFD) => {
            this.sFD = sFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sFDListModification',
            (response) => this.load(this.sFD.id)
        );
    }
}
