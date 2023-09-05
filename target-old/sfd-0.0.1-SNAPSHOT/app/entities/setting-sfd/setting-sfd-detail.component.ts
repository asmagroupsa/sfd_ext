import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { SettingSFD } from './setting-sfd.model';
import { SettingSFDService } from './setting-sfd.service';

@Component({
    selector: 'jhi-setting-sfd-detail',
    templateUrl: './setting-sfd-detail.component.html'
})
export class SettingSFDDetailComponent implements OnInit, OnDestroy {

    settingSFD: SettingSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private settingSFDService: SettingSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSettingSFDS();
    }

    load(id) {
        this.settingSFDService.find(id).subscribe((settingSFD) => {
            this.settingSFD = settingSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSettingSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'settingSFDListModification',
            (response) => this.load(this.settingSFD.id)
        );
    }
}
