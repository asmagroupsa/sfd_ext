import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { ServiceUser } from './service-user.model';
import { ServiceUserService } from './service-user.service';

@Component({
    selector: 'jhi-service-user-detail',
    templateUrl: './service-user-detail.component.html'
})
export class ServiceUserDetailComponent implements OnInit, OnDestroy {

    serviceUser: ServiceUser;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private serviceUserService: ServiceUserService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInServiceUsers();
    }

    load(id) {
        this.serviceUserService.find(id).subscribe((serviceUser) => {
            this.serviceUser = serviceUser;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInServiceUsers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'serviceUserListModification',
            (response) => this.load(this.serviceUser.id)
        );
    }
}
