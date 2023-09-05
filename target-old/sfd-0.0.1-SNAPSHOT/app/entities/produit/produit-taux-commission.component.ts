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
import {ProduitTauxCommissionDialogComponent} from './produit-taux-commission-dialog.component';
import { Produit } from './produit.model';
import { ProduitService } from './produit.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { Periodicity } from '../periodicity/periodicity.model';
import { UserData } from '../../shared/model/singleton';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
declare let select_init: any;

@Component({
    selector: 'jhi-produit-taux-commission',
    templateUrl: './produit-taux-commission.component.html'
})
export class ProduitTauxCommissionComponent implements OnInit, OnDestroy {
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
    taux:any[];

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
        public langue: LanguesService,
        private modalService: NgbModal
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

    loadAll() {
        this.produitService
            .getTauxCommissions()
            .subscribe(
                (res) => {
                    this.taux = res;
                },
                (res: ResponseWrapper) => this.onError(res)
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
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.loadAll();
    }
    ngOnInit() {
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

     updateTaux(taux) {
        const modalRef = this.modalService.open(ProduitTauxCommissionDialogComponent, { keyboard:false,
      size: "lg",
      backdrop: "static"
    });
    modalRef.componentInstance.model = Object.assign({},taux);
    }
}
