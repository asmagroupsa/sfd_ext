import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Produit } from '../produit/produit.model';
import { ProduitService } from '../produit/produit.service';
import { TauxEpargne } from './taux-epargne.model';
import { TauxEpargneService } from './taux-epargne.service';

@Component({
    selector: 'jhi-taux-epargne',
    templateUrl: './taux-epargne.component.html'
})
export class TauxEpargneComponent implements OnInit, OnDestroy {
    produits: Produit[];
    currentAccount: any;
    tauxEpargnes: TauxEpargne[];
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
        private tauxEpargneService: TauxEpargneService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private produitService: ProduitService,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
    }
    produit(id: any) {
        if (!this.produits) return new Produit();

        return this.produits.find(produit => {
            return produit.id == id;
        });
    }
    loadAll() {
        if (this.currentSearch) {
            this.tauxEpargneService
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
        this.tauxEpargneService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                NO_QUERY: true
            })
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadPage(page: number) {
        this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'taux-epargne'], {
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
            'taux-epargne',
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
            'taux-epargne',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.produitService.query({ products: true, size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.produits = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTauxEpargnes();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: TauxEpargne) {
        return item.id;
    }
    registerChangeInTauxEpargnes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'tauxEpargneListModification',
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
        //this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        this.tauxEpargnes = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
