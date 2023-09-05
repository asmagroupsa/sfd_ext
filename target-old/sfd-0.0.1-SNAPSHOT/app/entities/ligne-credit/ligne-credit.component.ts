import { Partner } from "../partner/partner.model";
import { PartnerService } from "../partner/partner.service";
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
import { LigneCreditListeComponent } from './ligne-credit-complement.component';
import { LigneCredit } from "./ligne-credit.model";
import { LigneCreditService } from "./ligne-credit.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, LOCAL_FLAG } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { Periodicity } from "../periodicity/periodicity.model";
import { PeriodicityService } from "../periodicity/periodicity.service";
import { UserData } from "../../shared/model/singleton";
import { SFDService } from "../s-fd";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SoldeLigneCreditDialogDialogComponent} from './solde-ligne-credit-dialog.component';
declare let select_init: any;

@Component({
    selector: "jhi-ligne-credit",
    templateUrl: "./ligne-credit.component.html"
})
export class LigneCreditComponent implements OnInit, OnDestroy {
    params: { [key: string]: any };
    currentAccount: any;
    ligneCredits: LigneCredit[];
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
    periodicity: Periodicity[];
    partners: Partner[];
    localFlag: boolean;

    constructor(
        private ligneCreditService: LigneCreditService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private periodicityService: PeriodicityService,
        private partnerService: PartnerService,
        public langue: LanguesService,
        private sfdService: SFDService,
        private _ngbModal: NgbModal,
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
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    ngAfterViewInit() {
        select_init();
    }
    showComplements(ligneCredit){
        const modalRef = this._ngbModal.open(LigneCreditListeComponent, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.ligneCredit = ligneCredit;
    }
    period(id: any) {
        if (!this.periodicity) return new Periodicity();
        return this.periodicity.find(periode => {
            return periode.id == id;
        });
    }
    getPeriodicity() {
        this.periodicityService.query().subscribe((res: ResponseWrapper) => {
            this.periodicity = res.json || this.principal.store["periodicity"];
            this.principal.store["periodicity"] = res.json;
        });
    }
    partner(id: any) {
        if (!this.partners) return new Partner();
        return this.partners.find(partner => {
            return partner.id == id;
        });
    }
    getPartners() {
        this.partnerService.query().subscribe((res: ResponseWrapper) => {
            this.partners = res.json || this.principal.store["partners"];
            this.principal.store["partners"] = res.json;
        });
    }
    loadAll() {
        const req: any = {
            size: this.itemsPerPage,
            sort: this.sort(),
            page: this.page - 1,
            // decaisser: true,
        };

        if (this.currentSearch) {
            req['libelle.contains'] = this.currentSearch;
            req['code.contains'] = this.currentSearch;
            req['condition'] = 'OR';
        }

        // this.sfdService.find(UserData.getInstance().sfdId)
        // .subscribe((s) => {
            req['sfdReference.equals'] = UserData.getInstance().getSFDReference();

            this.ligneCreditService
            .query(req)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        // });
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(["/entity", "ligne-credit"], {
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
            "ligne-credit",
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
            "ligne-credit",
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.localFlag = LOCAL_FLAG;
        this.loadAll();
        this.getPartners();
        this.getPeriodicity();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInLigneCredits();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: LigneCredit) {
        return item.id;
    }
    registerChangeInLigneCredits() {
        this.eventSubscriber = this.eventManager.subscribe(
            "ligneCreditListModification",
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
        this.ligneCredits = data;
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    toJSON(object: any) {
        return JSON.stringify(object);
    }

    openSoldeLigneCreditDialogDialog(ligneCredit) {
        const modalRef = this._ngbModal.open(SoldeLigneCreditDialogDialogComponent);
        modalRef.componentInstance.ligneCredit = ligneCredit;
    }
}
