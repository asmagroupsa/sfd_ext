import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { AccountType } from './account-type.model';
import { AccountTypeService } from './account-type.service';

@Component({
    selector: 'jhi-account-type-detail',
    templateUrl: './account-type-detail.component.html'
})
export class AccountTypeDetailComponent implements OnInit, OnDestroy {

    accountType: AccountType;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private accountTypeService: AccountTypeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInAccountTypes();
    }

    load(id) {
        this.accountTypeService.find(id).subscribe((accountType) => {
            this.accountType = accountType;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAccountTypes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'accountTypeListModification',
            (response) => this.load(this.accountType.id)
        );
    }
}
