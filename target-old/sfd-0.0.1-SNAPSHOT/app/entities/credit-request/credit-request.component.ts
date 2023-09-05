import { Component, OnDestroy, OnInit } from '@angular/core';
import {  DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { Client } from '../client/client.model';
import { ClientService } from '../client/client.service';
import { CreditRequestStatus } from '../credit-request-status/credit-request-status.model';
import { CreditRequestStatusService } from '../credit-request-status/credit-request-status.service';
import { Produit } from '../produit/produit.model';
import { ProduitService } from '../produit/produit.service';
import { CreditRequest } from './credit-request.model';
import { CreditRequestService } from './credit-request.service';

declare let select_init: any;
declare const hideEmptyDiv: any;

@Component({
    selector: 'jhi-credit-request',
    templateUrl: './credit-request.component.html',
    styleUrls: ['./credit-request.component.scss']
})
export class CreditRequestComponent implements OnInit, OnDestroy {
    creditrequeststatuses: CreditRequestStatus[];
    params: { [key: string]: any };
    currentAccount: any;
    creditRequests: CreditRequest[] = [];
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
    clients: Client[] = [];
    produits: Produit[] = [];
    public creditRequestStatusSelected: number = 0;
    public creditRequestStatusSelectedName: string = '';
    flagClass = { 'DEMANDE': 'no-threatment', 'REMBOURSSEMENT': 'remboursement', 'DECAISSEMENT': 'decaissement', 'CREDIT': 'credit', 'GARANTIE': 'garantie', 'FORMATION': 'formation', 'NOTIFICATION': 'notification', 'COMMITE': 'comite', 'ETUDE_DETAILLEE': 'detaillee', 'ETUDE_PREALABLE': 'prealable' };
date1: any;
    date2: any;

    constructor(
        private creditRequestService: CreditRequestService,
        private creditRequestStatusService: CreditRequestStatusService,
        private clientService: ClientService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _datePipe: DatePipe,
        public produitService: ProduitService
    ) {
        this.creditRequestStatusSelected = 10;
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.pagingParams = data['pagingParams'];
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    onPeriodChange() {
        this.loadAll();
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
    getClients() {
        this.creditRequestStatusService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.creditrequeststatuses = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
        this.clientService
            .query({ size: 1000 })
            .subscribe((res: ResponseWrapper) => {
                this.clients = res.json;
            });

        this.produitService
            .query({ size: 1000 })
            .subscribe((res: ResponseWrapper) => {
                this.principal.store['produits'] = res.json;
                this.produits = res.json;
            });
    }
    client() {
        if (!this.params || this.params['client']) return '';
        let client = this.clients.find(client => {
            return client.id == this.params['client'];
        });
        return client ? client.name + ' ' + (client.firstName || '') : '';
    }
    produit() {
        if (!this.params || this.params['produit']) return '';
        let produit = this.produits.find(produit => {
            return produit.id == this.params['produit'];
        });
        return produit ? produit.libelle : '';
    }
    getNom(id: any) {
        if (!this.clients) return new Client();
        return this.clients.find(client => {
            return client.id == id;
        });
    }
    getProduit(id: any) {
        let produits = this.principal.store['produits'] || this.produits;
        if (!produits) return new Produit();
        return produits.find(produit => {
            return produit.id == id;
        });
    }
    loadAll() {
        this.creditRequests = [];
        const formatDate = (date) =>{
            if(!date) return null;
            return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
        };

        if( this.creditRequestStatusSelected === 12 ) {
            const req1: any = {
                size: this.itemsPerPage,
                sort: ['id,desc'],
                page: this.page - 1,
                'requestStatusId.equals': 2,
                'isRevolving.equals': true,
                'createdDate.greaterOrEqualThan': formatDate(this.date1),
                'createdDate.lessOrEqualThan': formatDate(this.date2)
            };
            if (this.currentSearch) {
                req1['clientLib.contains'] = req1['expressionRequest.contains'] = req1['reference.contains'] = this.currentSearch;
                req1.condition = 'OR';
            }

            this.creditRequestService.query(req1)
                .subscribe(
                    (res: ResponseWrapper) => {
                        this.principal.store['demandes'] = res.json;
                        // if (this.currentSearch) {
                        //     this.creditRequests = this.creditRequests.concat(getNewItems(this.creditRequests, res.json))
                        // } else
                        this.onSuccess(res.json, res.headers);
                    },
                    (res: ResponseWrapper) => this.onError(res.json)
                );
        }else{
            const req2: any = {
                size: this.itemsPerPage,
                sort: ['id,desc'],
                page: this.page - 1,
                'requestStatusId.equals': this.creditRequestStatusSelected,
                'createdDate.greaterOrEqualThan': formatDate(this.date1),
                'createdDate.lessOrEqualThan': formatDate(this.date2)
            };

            if (this.currentSearch) {
                req2['clientLib.contains'] = req2['expressionRequest.contains'] = req2['reference.contains'] = this.currentSearch;
                req2.condition = 'OR';
            }

            this.creditRequestService.query(req2)
                .subscribe(
                    (res: ResponseWrapper) => {
                        this.principal.store['demandes'] = res.json;
                        // if (this.currentSearch) {
                        //     this.creditRequests = this.creditRequests.concat(getNewItems(this.creditRequests, res.json))
                        // } else
                        this.onSuccess(res.json, res.headers);
                    },
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
        this.router.navigate(['/entity', 'credit-request'], {
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
            'credit-request',
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
            'credit-request',
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
        this.getClients();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCreditRequests();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CreditRequest) {
        return item.id;
    }
    registerChangeInCreditRequests() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditRequestListModification',
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

        this.creditRequests = data;
        select_init();
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    public onCreditRequestStatuesChange(id: number = null, name: string = null): void {
        console.log(id, name);
        this.creditRequestStatusSelected = id;
        this.creditRequestStatusSelectedName = name;
        this.loadAll();
    }
}
