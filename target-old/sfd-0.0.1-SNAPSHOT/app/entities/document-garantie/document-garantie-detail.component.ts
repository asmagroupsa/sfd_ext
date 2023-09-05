import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager  } from 'ng-jhipster';

import { DocumentGarantie } from './document-garantie.model';
import { DocumentGarantieService } from './document-garantie.service';

@Component({
    selector: 'jhi-document-garantie-detail',
    templateUrl: './document-garantie-detail.component.html'
})
export class DocumentGarantieDetailComponent implements OnInit, OnDestroy {

    documentGarantie: DocumentGarantie;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private documentGarantieService: DocumentGarantieService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInDocumentGaranties();
    }

    load(id) {
        this.documentGarantieService.find(id).subscribe((documentGarantie) => {
            this.documentGarantie = documentGarantie;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInDocumentGaranties() {
        this.eventSubscriber = this.eventManager.subscribe(
            'documentGarantieListModification',
            (response) => this.load(this.documentGarantie.id)
        );
    }
}
