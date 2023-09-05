import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { CustomUser } from './custom-user.model';
import { CustomUserService } from './custom-user.service';

@Component({
    selector: 'jhi-custom-user-detail',
    templateUrl: './custom-user-detail.component.html'
})
export class CustomUserDetailComponent implements OnInit, OnDestroy {

    customUser: CustomUser;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private customUserService: CustomUserService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCustomUsers();
    }

    load(id) {
        this.customUserService.find(id).subscribe((customUser) => {
            this.customUser = customUser;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCustomUsers() {
        this.eventSubscriber = this.eventManager.subscribe(
            'customUserListModification',
            (response) => this.load(this.customUser.id)
        );
    }
}
