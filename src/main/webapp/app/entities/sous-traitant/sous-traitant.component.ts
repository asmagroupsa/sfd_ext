import {Component, OnInit, OnDestroy, AfterViewInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";
// import {Phase} from "./phase.model";
// import {PhaseService} from "./phase.service";
import {ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData} from "../../shared";
import {PaginationConfig} from "../../blocks/config/uib-pagination.config";
import {LanguesService} from "../../shared/myTranslation/langues";
import {ClientService} from "../client/client.service";
import {TypeClientService} from "../type-client/type-client.service";

declare const select_init;

@Component({
    selector: "jhi-sous-traitant",
    templateUrl: "./sous-traitant.component.html"
})
export class SousTraitantComponent implements OnInit, AfterViewInit, OnDestroy {
    currentAccount: any;
    clients = [];
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
    q: any = {};
    qs: Subscription;
    private _typeClientId;

    constructor(
        // private posteService: PhaseService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _clientService: ClientService,
        private _typeClientService: TypeClientService,
    ) {
        this.itemsPerPage = 1000000;
        // this.itemsPerPage = ITEMS_PER_PAGE;
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
        if (!this._typeClientId) {
            return;
        }

        if (this.currentSearch) {
            // this.posteService
            //     .search({
            //         query: this.currentSearch,
            //         size: this.itemsPerPage,
            //         sort: this.sort()
            //     })
            //     .subscribe(
            //     (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            //     (res: ResponseWrapper) => this.onError(res.json)
            //     );
            return;
        }
        this._clientService
        .query({
            page: this.page - 1,
            size: this.itemsPerPage,
            NO_QUERY: true,
            sort: this.sort(),
            'typeClientId.equals': this._typeClientId,
            'codeGuichet.contains': UserData.getInstance().getSFD().indicePrestataire + '-',
        }).toPromise()
        .then((res: ResponseWrapper) => this.onSuccess(res.json, res.headers))
        .catch((res: ResponseWrapper) => this.onError(res.json));
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(["/entity", "poste"], {
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
            "poste",
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
            "poste",
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this._typeClientService.query({
            'code.equals': 'SOUS_TRAITANT',
            'code.in': undefined,
        }).toPromise()
        .then((r) => {
            this._typeClientId = r.json[0].id;

            this.qs =  this.activatedRoute.queryParams.subscribe((q) => {
                this.q = q;
                this.loadAll();
            });
        })
        .catch(console.error);
        /* this.principal.identity().then(account => {
          this.currentAccount = account;
        }); */
        this.registerChangeInPostes();
    }

    ngAfterViewInit() {
        select_init();       
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);

        if (this.qs) {
            this.qs.unsubscribe();
        }
    }

    trackId(index: number, item) {
        return item.id;
    }
    registerChangeInPostes() {
        this.eventSubscriber = this.eventManager.subscribe(
            "sousTraitantListModification",
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
        // this.page = pagingParams.page;
        this.clients = data;
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
