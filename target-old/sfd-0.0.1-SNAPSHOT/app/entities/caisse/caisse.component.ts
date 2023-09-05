import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { CaisseService } from './caisse.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TransfertBankCoffreDialogComponent} from './transfert-bank-coffre-dialog.component';
import {TransfertCaisseDialogComponent} from './transfert-caisse-dialog.component';

@Component({
    selector: 'jhi-caisse',
    templateUrl: './caisse.component.html'
})
export class CaisseComponent implements OnInit, OnDestroy {
    currentAccount: any;
    caisses: Caisse[];
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
    predicate: any;
    previousPage: any;
    reverse: any;
    types = [
        {code: 'CAISSE', libelle: 'Caisse'},
        {code: 'COFFRE', libelle: 'Coffre'},
    ];
    currentType = this.types[0].code;

    constructor(
        private caisseService: CaisseService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _ngbModal: NgbModal,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe((data) => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.caisseService.search({
                page: this.page - 1,
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );

            return;
        }
        this.caisseService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/caisse'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/caisse',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
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
            '/caisse',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInCaisses();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Caisse) {
        return item.id;
    }
    registerChangeInCaisses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'caisseListModification',
            (response) => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.caisses = data;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    onTypeClick(type: string) {
        this.currentType = type;
    }

    transfert() {
        const m = this._ngbModal.open(TransfertBankCoffreDialogComponent, {
            size: 'lg',
            backdrop: 'static',
        });
        m.componentInstance.coffre = 'Test';
        m.componentInstance.model = {coffre_id: 10};
    }

    transfertCaisse() {
        const m = this._ngbModal.open(TransfertCaisseDialogComponent, {
            size: 'lg',
            backdrop: 'static',
        });
        m.componentInstance.caisseFrom = 'Test';
        m.componentInstance.model = {caisse_from_id: 10};
    }
}
