import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { LigneCredit } from './ligne-credit.model';
import { LigneCreditService } from './ligne-credit.service';

@Component({
    selector: 'jhi-ligne-credit-detail',
    templateUrl: './ligne-credit-detail.component.html',
    styleUrls: ['./ligne-credit-detail.component.css']
})
export class LigneCreditDetailComponent implements OnInit, OnDestroy {
    ficheLigne: any;
    ligneCredit: LigneCredit;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private ligneCreditService: LigneCreditService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInLigneCredits();
    }

    load(id) {
        this.ligneCreditService.find(id).subscribe((ligneCredit) => {
            this.ligneCredit = ligneCredit;
        });
        this.ligneCreditService.ficheLigneCredit(id).subscribe(
            response => {
                this.ficheLigne = Array.isArray(response) && response.length ? response[0] : response;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInLigneCredits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'ligneCreditListModification',
            (response) => this.load(this.ligneCredit.id)
        );
    }
}
