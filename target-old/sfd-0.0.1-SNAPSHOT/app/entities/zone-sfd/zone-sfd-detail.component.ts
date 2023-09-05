import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ZoneSfd } from './zone-sfd.model';
import { ZoneSfdService } from './zone-sfd.service';

@Component({
    selector: 'jhi-zone-sfd-detail',
    templateUrl: './zone-sfd-detail.component.html'
})
export class ZoneSfdDetailComponent implements OnInit, OnDestroy {

    zoneSfd: ZoneSfd;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private zoneSfdService: ZoneSfdService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInZoneSfds();
    }

    load(id) {
        this.zoneSfdService.find(id).subscribe((zoneSfd) => {
            this.zoneSfd = zoneSfd;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInZoneSfds() {
        this.eventSubscriber = this.eventManager.subscribe(
            'zoneSfdListModification',
            (response) => this.load(this.zoneSfd.id)
        );
    }
}
