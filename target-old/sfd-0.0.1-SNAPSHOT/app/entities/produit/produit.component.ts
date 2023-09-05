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

import { Produit } from './produit.model';
import { ProduitService } from './produit.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { Periodicity } from '../periodicity/periodicity.model';
import { UserData } from '../../shared/model/singleton';
declare let select_init: any;
@Component({
    selector: 'jhi-produit',
    templateUrl: './produit.component.html'
})
export class ProduitComponent implements OnInit, OnDestroy {
    categories: any[];
    periodicity: Periodicity[];
    category: any = {};
    currentAccount: any;
    produits: Produit[];
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
    platforms = [
        {
            r: 'SFD',
            l: 'Produits du SFD'
        },
        {
            r: 'FNM',
            l: 'Produits de FNM'
        },
    ];
    currentPlatform = this.platforms[0];

    constructor(
        private produitService: ProduitService,
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
    getPeriodicity() {
        this.produitService
            .queryCategories()
            .subscribe((res: ResponseWrapper) => {
                this.categories = res.json;
                this.category = this.categories[1];
                this.principal.store['categoriesProduits'] = res.json;

                this.changeCategorie(this.category);
            });
        this.periodicityService.query().subscribe((res: ResponseWrapper) => {
            this.periodicity = res.json;
            this.principal.store['periodicity'] = res.json;
        });
    }

    loadAll() {
        console.log(UserData.getInstance().getSFDReference());
        console.log(UserData.getInstance().getSFD().code);
 
        this.produits = [];
        const req: any = {
            size: this.itemsPerPage,
            sort: this.sort(),
            // 'sfdReference.equals': UserData.getInstance().getSFDReference(),
            'sfdReference.equals': UserData.getInstance().getSFDReference(),
        };

        if (this.currentSearch) {
            req.query = this.currentSearch;
        }

        if (this.currentPlatform.r === 'FNM') {
            req.NO_QUERY = true;

            this.produitService
            .produitsEligibles(req)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        }

        else {
            req['categorieProduitId.equals'] = this.category.id;

            this.produitService
            .query(req)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        }
    }

    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        /*  this.router.navigate(['/entity', 'produit'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    }); */
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
        this.getPeriodicity();
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProduits();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Produit) {
        return item.id;
    }
    registerChangeInProduits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'produitListModification',
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
    private eligibleProduits(data, headers) {
        data = data.map(element => {
            return element.produit;
        });
        this.onSuccess(data, headers);
    }
    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        this.produits = data;
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    onPlatformChange(tc) {
        this.currentPlatform = tc;
        this.loadAll();
    }

    jhiHasAnyRessources(r) {
        return this.principal.hasAnyRessources(r);
    }
}
