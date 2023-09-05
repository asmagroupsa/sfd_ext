import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { NotificationSFD } from './notification-sfd.model';
import { NotificationSFDService } from './notification-sfd.service';

@Component({
    selector: 'jhi-notification-sfd-detail',
    templateUrl: './notification-sfd-detail.component.html'
})
export class NotificationSFDDetailComponent implements OnInit, OnDestroy {

    notificationSFD: NotificationSFD;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private notificationSFDService: NotificationSFDService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInNotificationSFDS();
    }

    load(id) {
        this.notificationSFDService.find(id).subscribe((notificationSFD) => {
            this.notificationSFD = notificationSFD;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInNotificationSFDS() {
        this.eventSubscriber = this.eventManager.subscribe(
            'notificationSFDListModification',
            (response) => this.load(this.notificationSFD.id)
        );
    }
}
