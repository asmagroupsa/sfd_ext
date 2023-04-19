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

import { Compte } from "./compte.model";
import { CompteService } from "./compte.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { AccountTypeService } from "../account-type/account-type.service";
import { ClientService } from "../client/client.service";
import { AccountType } from "../account-type/account-type.model";
import { Client } from "../client/client.model";
import { getNewItems } from "../../shared/model/functions";

@Component({
    selector: "jhi-compte",
    templateUrl: "./compte.component.html"
})
export class CompteComponent implements OnInit, OnDestroy {
    accounttypes: AccountType[];
    clients: Client[];
    currentAccount: any;
    comptes: Compte[] = [];
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
        private compteService: CompteService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private accountTypeService: AccountTypeService,
        private clientService: ClientService,
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
    client(id: any) {
        if (!this.clients) return new Client();
        return this.clients.find(client => {
            return client.id == id;
        });
    }
    account(id: any) {
        if (!this.accounttypes) return new AccountType();
        return this.accounttypes.find(account => {
            return account.id == id;
        });
    }
    getClients() {
        this.accountTypeService
            .query({ size: 1000 })
            .subscribe((res: ResponseWrapper) => {
                this.accounttypes = res.json;
            });
        this.clientService
            .query({ size: 10000 })
            .subscribe((res: ResponseWrapper) => {
                this.clients = res.json;
            });
    }
    loadAll() {
        if (this.currentSearch) {
            this.compteService
                .query({
                    'numAccount.contains': this.currentSearch,
                    sort: this.sort(),
                    NO_QUERY: true
                })
                .subscribe(
                    (res: ResponseWrapper) => {
                        this.comptes = this.comptes.concat(getNewItems(this.comptes, res.json))
                    },
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
        }
        this.compteService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                NO_QUERY: true,
                'numAccount.contains': this.currentSearch
            })
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
        this.router.navigate(["/entity", "compte-client"], {
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
            "compte-client",
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
            "compte-client",
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
        this.getClients();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInComptes();
    }

    ngOnDestroy() {
        if (this.eventManager && this.eventSubscriber)
            if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Compte) {
        return item.id;
    }
    registerChangeInComptes() {
        if (this.eventManager) {
            this.eventSubscriber = this.eventManager.subscribe(
                "compteListModification",
                response => this.loadAll()
            );
        }
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
        this.comptes = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
