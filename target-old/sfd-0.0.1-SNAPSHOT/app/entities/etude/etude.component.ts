import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService,
    JhiDataUtils
} from 'ng-jhipster';

import { Etude } from './etude.model';
import { EtudeService } from './etude.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CreditRequestStatusService } from '../credit-request-status/credit-request-status.service';
declare const select_init: any;
@Component({
    selector: 'jhi-etude',
    templateUrl: './etude.component.html',
    styleUrls: ['./etude.component.scss']
})
export class EtudeComponent implements OnInit, OnDestroy {
    creditrequeststatuses: any[] = [];
    prealables: any[];
    detaillees: any[];
    revolving: any[];
    listes: any[] = [];
    currentAccount: any;
    etudes: any[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    pagingParams: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    tab2: number = 1;

    constructor(
        private etudeService: EtudeService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private creditRequestStatusService: CreditRequestStatusService,
        private activatedRoute: ActivatedRoute,
        private dataUtils: JhiDataUtils,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.pagingParams = data['pagingParams'];
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
    }
    ngAfterViewInit() {
        select_init();
    }
    status(id: any) {
        if (!this.creditrequeststatuses || !id) return 'Demande non traitée';
        let status = this.creditrequeststatuses.find(status => {
            return status.id == id;
        });
        switch (status['name']) {
            case 'ETUDE_PREALABLE':
                return "Déja passé à l'étude préalable";
            case 'ETUDE_DETAILLEE':
                return "Déja passé à l'étude détaillée";
            case 'COMMITE':
                return 'Passé au comité';
            case 'NOTIFICATION':
                return 'déja notifié';
            case 'CREDIT':
                return 'credit accordé';
            case 'DECAISSEMENT':
                return 'déja décaissé';
            case 'REMBOURSSEMENT':
                return 'credit remboursé';
            case 'FORMATION':
                return 'client de la demande déjà formé';
            case 'GARANTIE':
                return 'demande garantissée';
            default:
                return 'Demande non traitée';
        }
    }
    loadAll() {
        if (this.currentSearch) {
            this.etudeService
                .search({
                    query: this.currentSearch,
                    size: this.itemsPerPage,
                    sort: this.sort()
                })
                .subscribe(
                    (res: ResponseWrapper) =>
                        this.onSuccess(res.json, res.headers),
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
        }
        this.creditRequestStatusService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.creditrequeststatuses = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.etudeService
            .queryEtudePrealable()
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.etudeService
            .queryEtudeDetaillee()
            .subscribe(
                (res: ResponseWrapper) => (this.detaillees = res.json),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.etudeService
            .queryRevolving()
            .subscribe(
                (res: ResponseWrapper) => (this.revolving = res.json),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    // changeTab(index: number) {
    //     this.tab2 = index;
    //     this.etudes = this.tab2 == 1 ? this.prealables : this.detaillees;
    //     if (index == 1) select_init();
    // }

    changeTab(index: number) {
        this.tab2 = index;
        if(this.tab2 == 1) {
            this.etudes = this.prealables;
        } else if(this.tab2 == 2 ) {
            this.etudes = this.detaillees;
        } else if(this.tab2 == 3 ){
            this.etudes = this.revolving;
        }

        if (index == 1) select_init();
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'etude'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/entity',
            'etude',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/entity',
            'etude',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInEtudes();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Etude) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInEtudes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'etudeListModification',
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        this.prealables = data;
        this.etudes = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
