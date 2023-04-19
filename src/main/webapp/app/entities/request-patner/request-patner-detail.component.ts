import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';
import { RequestPartnerService } from './request-patner.service';
import { RequestPartner } from './request-patner.model';


@Component({
    selector: 'jhi-request-partner-detail',
    templateUrl: './request-patner.component.html',
    styleUrls:[`./request-patner-detail.component.scss`]
})
export class RequestPartnerDetailComponent implements OnInit, OnDestroy {

    requestPartner: RequestPartner;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private produitService: RequestPartnerService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProduits();
    }

    load(id) {
        this.produitService.find(id).subscribe((produit) => {
            this.requestPartner = produit;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProduits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'produitListModification',
            (response) => this.load(this.requestPartner.id)
        );
    }
}
