import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";

import { Penality } from "./tranche-penal.model";
import { PenalityService } from "./penality.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
declare let select_init: any;
@Component({
    selector: "jhi-penality",
    templateUrl: "./penality.component.html"
})
export class PenalityComponent implements OnInit, OnDestroy {
    currentAccount: any;
    penalities: Penality[];
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
        private penalityService: PenalityService,
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
            this.pagingParams = data["pagingParams"];
            this.previousPage = data["pagingParams"].page;
            this.reverse = data["pagingParams"].ascending;
            this.predicate = data["pagingParams"].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params["search"]
            ? activatedRoute.snapshot.params["search"]
            : "";
    }
    ngAfterViewInit() {
        setTimeout(() => {
            select_init();
        }, 1200);
    }

    loadAll() {
        /* if (this.currentSearch) {
            this.penalityService
            .search({
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        } */
        this.penalityService
        .query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            'libelle.contains': this.currentSearch
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
        this.router.navigate(["/entity", "penality"], {
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
        this.currentSearch = '';
        this.router.navigate(["/entity", "penality", {
            page: this.page,
            sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
        }]);
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
            "penality",
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
        // this.registerChangeInTranchePenals();
    }

    ngOnDestroy() {
        // if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    /* trackId(index: number, item: Penality) {
        return item.id;
    } */
    /* registerChangeInTranchePenals() {
        this.eventSubscriber = this.eventManager.subscribe(
            "tranchePenalListModification",
            response => this.loadAll()
        );
    } */

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
        this.penalities = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
