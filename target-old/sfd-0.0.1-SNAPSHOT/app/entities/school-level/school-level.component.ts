import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { SchoolLevel } from './school-level.model';
import { SchoolLevelService } from './school-level.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';

@Component({
    selector: 'jhi-school-level',
    templateUrl: './school-level.component.html'
})
export class SchoolLevelComponent implements OnInit, OnDestroy {
schoolLevels: SchoolLevel[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private schoolLevelService: SchoolLevelService,
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
            this.schoolLevelService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.schoolLevels = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.schoolLevelService.query().subscribe(
            (res: ResponseWrapper) => {
                this.schoolLevels = res.json;
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
        this.registerChangeInSchoolLevels();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SchoolLevel) {
        return item.id;
    }
    registerChangeInSchoolLevels() {
        this.eventSubscriber = this.eventManager.subscribe('schoolLevelListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
