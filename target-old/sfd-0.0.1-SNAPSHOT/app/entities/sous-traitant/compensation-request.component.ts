import {Component, OnInit, OnDestroy} from "@angular/core";
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
import {ITEMS_PER_PAGE, Principal, ResponseWrapper, createRequestOption, HOST, UserData} from "../../shared";
import {PaginationConfig} from "../../blocks/config/uib-pagination.config";
import {LanguesService} from "../../shared/myTranslation/langues";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CompensationRequestDialogComponent} from "./compensation-request-dialog.component";
import {Http} from "@angular/http";

@Component({
    selector: "jhi-compensation-request",
    templateUrl: "./compensation-request.component.html"
})
export class CompensationRequestComponent implements OnInit, OnDestroy {
    currentAccount: any;
    phases = [];
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
    requests = [];

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
        private _ngbModal: NgbModal,
        private _http: Http,
    ) {
        // this.itemsPerPage = ITEMS_PER_PAGE;
        // this.routeData = this.activatedRoute.data.subscribe(data => {
        //     this.page = data["pagingParams"].page;
        //     this.previousPage = data["pagingParams"].page;
        //     this.reverse = data["pagingParams"].ascending;
        //     this.predicate = data["pagingParams"].predicate;
        // });
        // this.currentSearch = activatedRoute.snapshot.params["search"]
        //     ? activatedRoute.snapshot.params["search"]
        //     : "";
    }

    loadAll() {
        this._http.get(
            HOST + '/api/request-compensations',
            createRequestOption({
                size: 1000000,
                'sort': 'id,desc',
                'typeRequest.equals': 'SOUS_TRAITANT',
                'compteCarmes.equals': UserData.getInstance().account.login,
            })
        )
        .map((r) => r.json())
        .toPromise()
        .then((data) => {
            this.requests = data;
        })
        .catch(console.error);
    }

    ngOnInit() {
        this.loadAll();
        this.eventSubscriber = this.eventManager.subscribe(
            "sousTraitantCompensationRequestListModification",
            response => this.loadAll()
        );
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    dialog() {
        this._ngbModal.open(CompensationRequestDialogComponent, {size: 'sm'});
    }
}
