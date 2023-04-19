import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks} from 'ng-jhipster';
import {Subscription} from 'rxjs';

import {PaginationConfig} from '../../blocks/config/uib-pagination.config';
import {ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData} from '../../shared';
import {LanguesService} from '../../shared/myTranslation/langues';
import {Compensation} from './compensation.model';
import {CompensationService} from './compensation.service';
import {SPFNMService} from "../../shared/sp-fnm.service";

@Component({
    selector: "jhi-compensation",
    templateUrl: "./compensation.component.html"
})
export class CompensationComponent implements OnInit, OnDestroy {
    currentAccount: any;
    compensations: Compensation[];
    ordreVirements: any[];
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
    types: any[] = [
        /* {
            code: 'ORDRE',
            label: 'ORDRE DE VIREMENT'
        }, */
        {
            code: 'COMPENSATION',
            label: 'COMPENSATION'
        }
    ];
    currentType: any;

    constructor(
        private compensationService: CompensationService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _spFNMService: SPFNMService,
    ) {
        if (!UserData.getInstance().isSousTraitant()) {
            this.types.unshift({
                code: 'ORDRE',
                label: 'ORDRE DE VIREMENT'
            });
        }

        this.currentType = this.types[0];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data["pagingParams"].page;
            this.pagingParams = data["pagingParams"];
            this.previousPage = data["pagingParams"].page;
            this.reverse = data["pagingParams"].ascending;
            this.predicate = data["pagingParams"].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params["search"]
            ? activatedRoute.snapshot.params["search"]
            : "";
    }
    getDate(date){
        if(!date) return '';
        date = date.toString();
        let d;
        try {
            d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} à ${d.getHours()}:${d.getMinutes()}`;
        } catch (error) {
             return '';
        }
    }
    changeType(t) {
        this.currentType = t;
        this.loadAll();
    }
    loadAll() {
        if (this.isSousTraitant()) {
            this._spFNMService.listeCompensationByCompensateur({compte_carmes: UserData.getInstance().account.login})
            .then((data) => {
                this.compensations = data;
            })
            .catch(console.error);

            return;
        }

        if (!UserData.getInstance().currentSfdReference) {
            this.ordreVirements = [];
            return;
        }
        if (this.currentSearch) {
            let req = this.compensationService
                .query({
                    'amount.contains': this.currentSearch,
                    sort: this.sort()
                });
            // if (this.currentType == this.types[0]) {
                if (this.currentType.code === 'ORDRE') {
                req = this.compensationService
                    .getOrdreVirements({
                        'acteurReference.equals': UserData.getInstance().currentSfdReference,
                        sort: this.sort(),
                        NO_QUERY: true
                    });
            }
            req.subscribe(
                (res: ResponseWrapper) => {
                    /* this.compensations = this.compensations.concat(getNewItems(this.compensations, res.json)) */
                    this.onSuccess(res.json, res.headers);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        }
        let req = this.compensationService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                // NO_QUERY: true
            });
        if (this.currentType.code === 'ORDRE') {
        // if (this.currentType == this.types[0]) {
            req = this.compensationService
                .getOrdreVirements({
                    page: this.page - 1,
                    size: this.itemsPerPage,
                    'acteurReference.equals': UserData.getInstance().currentSfdReference,
                    sort: this.sort(),
                    NO_QUERY: true
                });
        }
        req.subscribe(
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
        this.router.navigate(["/entity", "compensation"], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = "";
        this.router.navigate([
            "/entity",
            "compensation",
            {
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
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
            "/entity",
            "compensation",
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCompensations();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Compensation) {
        return item.id;
    }
    registerChangeInCompensations() {
        this.eventSubscriber = this.eventManager.subscribe(
            "compensationListModification",
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
        if (this.predicate !== "id") {
            result.push("id");
        }
        return result;
    }

    private onSuccess(data, headers) {
        if (headers.get("link"))
            this.links = this.parseLinks.parse(headers.get("link"));
        this.totalItems = headers.get("X-Total-Count");
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        if (this.currentType.code === 'ORDRE')
            this.ordreVirements = data;
        if (this.currentType.code === 'COMPENSATION')
            this.compensations = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    isSousTraitant() {
        return UserData.getInstance().isSousTraitant();
    }
}
