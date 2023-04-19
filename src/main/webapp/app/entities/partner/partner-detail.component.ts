import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { Partner } from './partner.model';
import { PartnerService } from './partner.service';
import { StateService } from '../../shared/state/statistiques';

@Component({
    selector: 'jhi-partner-detail',
    templateUrl: './partner-detail.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class PartnerDetailComponent implements OnInit, OnDestroy {

    partner: Partner;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private partnerService: PartnerService,
        private route: ActivatedRoute,
        private _stateService: StateService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPartners();
    }

    load(id) {
        this.partnerService.find(id).subscribe((partner) => {
            this.partner = partner;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPartners() {
        this.eventSubscriber = this.eventManager.subscribe(
            'partnerListModification',
            (response) => this.load(this.partner.id)
        );
    }

    printAsPdf(printArea): void {
        this._stateService.printAsPdf(printArea);
    }
}
