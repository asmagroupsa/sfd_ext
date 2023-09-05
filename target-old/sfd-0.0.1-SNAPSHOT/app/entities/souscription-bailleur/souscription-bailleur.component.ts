import {Component, OnInit, OnDestroy, AfterViewInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiAlertService
} from "ng-jhipster";

import {SouscriptionBailleur} from "./souscription-bailleur.model";
import {SouscriptionBailleurService} from "./souscription-bailleur.service";
import {ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData} from "../../shared";
import {PaginationConfig} from "../../blocks/config/uib-pagination.config";
import {LanguesService} from "../../shared/myTranslation/langues";
import {setDotContains} from "../../shared/model/functions";
declare const select_init: any;
@Component({
    selector: "jhi-souscription-bailleur",
    templateUrl: "./souscription-bailleur.component.html"
})
export class SOUSCRIPTIONBAILLEURComponent implements OnInit, OnDestroy, AfterViewInit {
    ngAfterViewInit() {
        select_init();
    }
    currentAccount: any;
    souscriptionBailleurS: SouscriptionBailleur[];
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
    loader = {souscriptionbailleurs: false};

    constructor(
        private souscriptionBailleurService: SouscriptionBailleurService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
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
    }

    loadAll() {
        const req: any = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            //partner: UserData.getInstance().partnerId,
        };

        if (this.currentSearch) {
            req.condition = 'OR';
            setDotContains(req, ['address', 'bp', 'city', 'compteCarmes', 'email', 'name', 'phone'], this.currentSearch);
        }

        this.souscriptionBailleurS = [];
        this.loader.souscriptionbailleurs = true;
        this.souscriptionBailleurService.query(req)
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
        this.router.navigate(['/entity', "souscription-bailleur"], {
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
            ['/entity', "souscription-bailleur"],
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
            ['/entity', "souscription-bailleur"],
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "asc" : "desc")
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSOUSCRIPTIONBAILLEURS();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: SouscriptionBailleur) {
        return item.id;
    }
    registerChangeInSOUSCRIPTIONBAILLEURS() {
        this.eventSubscriber = this.eventManager.subscribe(
            "souscriptionBailleurListModification",
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
        this.loader.souscriptionbailleurs = false;
        //this.links = this.parseLinks.parse(headers.get("link"));
        //this.totalItems = headers.get("X-Total-Count");
        //this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.souscriptionBailleurS = data;
        select_init();
    }
    private onError(error) {
        this.loader.souscriptionbailleurs = false;
        this.alertService.error(error.message, null, null);
    }
}
