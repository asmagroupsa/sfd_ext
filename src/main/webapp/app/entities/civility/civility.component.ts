import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { Civility } from './civility.model';
import { CivilityService } from './civility.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';

@Component({
    selector: 'jhi-civility',
    templateUrl: './civility.component.html'
})
export class CivilityComponent implements OnInit, OnDestroy {
civilities: Civility[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private civilityService: CivilityService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public  principal: Principal,
        public langue:LanguesService
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.civilityService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.civilities = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.civilityService.query().subscribe(
            (res: ResponseWrapper) => {
                this.civilities = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCivilities();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Civility) {
        return item.id;
    }
    registerChangeInCivilities() {
        this.eventSubscriber = this.eventManager.subscribe('civilityListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
