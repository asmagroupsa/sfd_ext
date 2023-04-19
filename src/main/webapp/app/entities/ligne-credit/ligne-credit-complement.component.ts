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

import { LigneCredit } from "./ligne-credit.model";
import { LigneCreditService } from "./ligne-credit.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, LOCAL_FLAG } from "../../shared";
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
    selector: "jhi-ligne-credit-complement",
    templateUrl: "./ligne-credit-complement.component.html"
})
export class LigneCreditListeComponent implements OnInit, OnDestroy {
    ligneCredit: LigneCredit;
    error: any;
    params:any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    pagingParams: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    complements: any[];

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
        public activeModal: NgbActiveModal,
        private _ngbModal: NgbModal,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
           /*  */
        });
        this.currentSearch = activatedRoute.snapshot.params["search"]
            ? activatedRoute.snapshot.params["search"]
            : "";
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    ngAfterViewInit() {
        //select_init();
    }
    loadAll() {
        const req: any = {
            size: 1000,
            'ligneCreditId.equals': this.ligneCredit.id
        };
            req['sfdReference.equals'] = UserData.getInstance().getSFDReference();

            this.ligneCreditService
            .queryComplements(req)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
        // });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }
    ngOnInit() {
        this.loadAll();
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

    private onSuccess(data, headers) {
        if (headers.get("link"))
            this.links = this.parseLinks.parse(headers.get("link"));
        this.totalItems = headers.get("X-Total-Count");
        this.queryCount = this.totalItems;
        this.complements = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    toJSON(object: any) {
        return JSON.stringify(object);
    }
}
