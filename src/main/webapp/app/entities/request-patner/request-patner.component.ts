import { LOCAL_FLAG } from '../../shared/model/request-util';
import { periodicity } from '../entity.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { Periodicity } from '../periodicity/periodicity.model';
import { UserData } from '../../shared/model/singleton';
import { RequestPartnerService } from './request-patner.service';
import { RequestPartner } from './request-patner.model';
declare let select_init: any;
@Component({
    selector: 'jhi-request-patner',
    templateUrl: './request-patner.component.html'
})
export class RequestPartnerComponent implements OnInit, OnDestroy {
    categories: any[];
    periodicity: Periodicity[];
    category: any = {};
    currentAccount: any;
    requestPartners: RequestPartner[];
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

    constructor(
        private requestPartenerService: RequestPartnerService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private periodicityService: PeriodicityService,
        private activatedRoute: ActivatedRoute,
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

    changeCategorie(categorie: any) {
        this.category = categorie;
        // if (LOCAL_FLAG) {
        this.loadAll();
        select_init();
        // }
    }

    loadAll() {
        this.requestPartenerService
            .query()
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'request-partner'], {
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
        /* this.router.navigate([
      '/entity',
      'produit',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    ]); */
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        /* this.router.navigate([
      '/entity',
      'produit',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    ]); */
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: RequestPartner) {
        return item.id;
    }
    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        this.requestPartners = this.filterByCUrentSfd(data);
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    jhiHasAnyRessources(r) {
        return this.principal.hasAnyRessources(r);
    }

    filterByCUrentSfd(data: RequestPartner[]) {
        let datas: RequestPartner[] = [];
        data.forEach((data) => {
            if (data.sfd != null) {
                if (data.sfd.id == UserData.getInstance().sfdId) {
                    datas.push(data);
                }
            }

        })
        return datas;
    }
}
