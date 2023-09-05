import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BankAccountClient } from './bank-account-client.model';
import { BankAccountClientService } from './bank-account-client.service';

@Component({
    selector: 'jhi-bank-account-client-detail',
    templateUrl: './bank-account-client-detail.component.html'
})
export class BankAccountClientDetailComponent implements OnInit, OnDestroy {

    bank: BankAccountClient;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private bankService: BankAccountClientService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBanks();
    }

    load(id) {
        this.bankService.find(id).subscribe((bank) => {
            this.bank = bank;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBanks() {
        this.eventSubscriber = this.eventManager.subscribe(
            'bankListModification',
            (response) => this.load(this.bank.id)
        );
    }
}
