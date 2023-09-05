import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { OperationService } from '.';


@Component({
    selector: 'jhi-commissions-guichetier',
    templateUrl: './commission.component.html'
})
export class ListeCommissionsGuichetierComponent implements OnInit, OnDestroy {
    params: { [key: string]: any; };
    commissions = [];
    // currentAccount: any;
    eventSubscriber: Subscription;
    // currentSearch: string;
    date = {};

    constructor(
        private operationService: OperationService,
        private alertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public principal: Principal
    ) {
        // this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    listeOperationGuichetier() {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.params = params;
            const login = this.params.login || this.principal.userIdentity.login;

            this.operationService.listeCommissionsGuichetier(login)
                .subscribe(
                    (commissions) => {
                        this.commissions = commissions;
                    },
            );
        });
        /* if (this.currentSearch) {
            this.operationTypeService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.operations = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.operationTypeService.query().subscribe(
            (res: ResponseWrapper) => {
                this.operations = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
        ); */
    }

    /* search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    } */

    /* clear() {
        this.currentSearch = '';
        this.loadAll();
    } */

    ngOnInit() {
        this.listeOperationGuichetier();
        /* this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInOperationTypes(); */
    }

    ngOnDestroy() {
        // if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    /* byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerChangeInOperationTypes() {
        this.eventSubscriber = this.eventManager.subscribe('operationTypeListModification', (response) => this.loadAll());
    }

    private _onError(error) {
        this.alertService.error(error.message, null, null);
    } */

    /* onDateChange() {
        this.listeOperationGuichetier(this.date);
    } */
}
