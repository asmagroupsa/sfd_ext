import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager , JhiDataUtils } from 'ng-jhipster';

import { Etude } from './etude.model';
import { EtudeService } from './etude.service';

@Component({
    selector: 'jhi-etude-detail',
    templateUrl: './etude-detail.component.html'
})
export class EtudeDetailComponent implements OnInit, OnDestroy {

    etude: Etude;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private etudeService: EtudeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEtudes();
    }

    load(id) {
        this.etudeService.find(id).subscribe((etude) => {
            this.etude = etude;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEtudes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'etudeListModification',
            (response) => this.load(this.etude.id)
        );
    }
}
