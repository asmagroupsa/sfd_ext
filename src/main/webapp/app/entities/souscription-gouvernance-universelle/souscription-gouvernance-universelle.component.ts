import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiAlertService
} from "ng-jhipster";

import { SouscriptionGouvernanceUniverselle } from "./souscription-gouvernance-universelle.model";
import { SouscriptionGouvernanceUniverselleService } from "./souscription-gouvernance-universelle.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { getNewItems, setDotContains } from "../../shared/model/functions";
import { DatePipe } from "@angular/common";
declare const select_init: any;
@Component({
    selector: "jhi-souscription-gouvernance-universelle",
    templateUrl: "./souscription-gouvernance-universelle.component.html"
})
export class SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent implements OnInit, OnDestroy, AfterViewInit {
    ngAfterViewInit() {
        select_init();
    }
    currentAccount: any;
    souscriptionGouvernanceUniverselleS: SouscriptionGouvernanceUniverselle[];
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
    loader = { souscriptiongouvernanceuniverselle: false };
    date1: any;
    date2: any;
    products: any[] = [];
    produit_id: any;


    constructor(
        private souscriptionGouvernanceUniverselleService: SouscriptionGouvernanceUniverselleService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _datePipe: DatePipe
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data["pagingParams"].page;
            this.previousPage = data["pagingParams"].page;
            this.reverse = data["pagingParams"].ascending;
            this.predicate = data["pagingParams"].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params["search"]
            ? activatedRoute.snapshot.params["search"]
            : "";

        let now = new Date();
        this.date2 = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        now.setMonth(now.getMonth() - 1);
        this.date1 = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    }

    loadAll() {
        const req: any = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            produit_id: this.produit_id,
            date1: this.formatDate(this.date1),
            date2: this.formatDate(this.date2)
        };

        console.log(req);


        if (this.currentSearch) {
            req.condition = 'OR';
            setDotContains(req, ['address', 'bp', 'city', 'compteCarmes', 'email', 'name', 'phone'], this.currentSearch);
        }

        this.souscriptionGouvernanceUniverselleS = [];
        this.loader.souscriptiongouvernanceuniverselle = true;
        this.souscriptionGouvernanceUniverselleService.query(req)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.currentSearch = '';
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', "souscription-gouvernance-universelle"], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + "," + (this.reverse ? "asc" : "desc")
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = "";
        this.router.navigate([
            ['/entity', "souscription-gouvernance-universelle"],
            {
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "asc" : "desc")
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
            ['/entity', "souscription-gouvernance-universelle"],
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "asc" : "desc")
            }
        ]);
        this.loadAll();
    }

    onPeriodChange() {
        if (!this.date1 && !this.date2) {
            return;
        }

        this.loadAll();
    }
    ngOnInit() {
        this.souscriptionGouvernanceUniverselleService.queryProduct('').subscribe(
            (res: ResponseWrapper) => {
                console.log(res);

                this.products = this.products.concat(getNewItems(this.products, res.json));
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );

        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

        this.registerChangeInSOUSCRIPTIONGOUVERNANCEUNIVERSELLES();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SouscriptionGouvernanceUniverselle) {
        return item.id;
    }
    registerChangeInSOUSCRIPTIONGOUVERNANCEUNIVERSELLES() {
        this.eventSubscriber = this.eventManager.subscribe(
            "souscriptionGouvernanceUniverselleListModification",
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + "," + (this.reverse ? "asc" : "desc")];
        if (this.predicate !== "id") {
            result.push("id");
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.loader.souscriptiongouvernanceuniverselle = false;
        //this.links = this.parseLinks.parse(headers.get("link"));
        //this.totalItems = headers.get("X-Total-Count");
        //this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.souscriptionGouvernanceUniverselleS = data;
        select_init();
    }
    private onError(error) {
        this.loader.souscriptiongouvernanceuniverselle = false;
        this.alertService.error(error.message, null, null);
    }

    formatDate = (date) => {
        if (!date) return null;
        return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
    }
}
