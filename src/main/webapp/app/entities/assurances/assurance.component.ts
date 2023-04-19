import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";

import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { ClientService } from "../client/client.service";
import { Client } from "../client/client.model";
import { DistrictService } from "../district/district.service";
import { District } from "../district/district.model";
import { Assurance } from "./assurance.model";
import { AssuranceService } from "./assurance.service";
import { DatePipe } from "@angular/common";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
declare const select_init: any;


@Component({
    selector: "jhi-address",
    templateUrl: "./assurance.component.html",
    styleUrls: ['../../shared/state/state.scss']
})
export class AssuranceComponent implements OnInit, OnDestroy, AfterViewInit {
    params: { [key: string]: any };
    client: Client;
    assurance: any[];
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
    date1: any;
    date2: any;
    listAssurance = [];
    end: number;
    start: number = 0;
    filtredAssureData = [];
    loading = false;
    decaisementModal: NgbModalRef;
    sinistreModal: NgbModalRef;
    listAyantDroit: any[] = [];
    userdata = UserData.getInstance();

    constructor(
        private assuranceService: AssuranceService,
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
        private ngbModal: NgbModal,

    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data["pagingParams"].page;
            this.pagingParams = data["pagingParams"];
            this.previousPage = data["pagingParams"].page;
            this.reverse = data["pagingParams"].ascending;
            this.predicate = data["pagingParams"].predicate;

            this.end = this.itemsPerPage;
        });
        this.currentSearch = activatedRoute.snapshot.params["search"]
            ? activatedRoute.snapshot.params["search"]
            : "";
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });
    }
    loadAll() {
        this.loading = true;
        /* const formatDate = (date) => {
            if (!date) return null;
            return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
            'date1': formatDate(this.date1),
            'date2': formatDate(this.date2)
        }; */
        this.assuranceService
            .query({
                NO_QUERY: true,
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                'sfd_reference': (UserData.getInstance().sfd || UserData.getInstance().currentSfdReference),
                'agence_reference': (UserData.getInstance().currentAgence.codeAgence),
            })
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    /* onPeriodChange() {
        if (!this.date1 && !this.date2) {
            return;
        }
        this.loadAll();
    } */
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.transition(page);
        }
    }
    transition(page: number) {
        this.router.navigate(["/assurance"], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        });
        this.loadAssure(page);
    }

    loadAssure(page: number) {
        this.listAssurance = [];
        const interval = Math.abs(page - this.previousPage);

        if (this.previousPage < page)
            this.start = this.start + (interval * this.itemsPerPage);
        else this.start = this.start - (interval * this.itemsPerPage);

        this.end = this.start + this.itemsPerPage;

        if (this.currentSearch)
            this.listAssurance = this.filtredAssureData.slice(this.start, this.end);
        else this.listAssurance = this.assurance.slice(this.start, this.end);

        this.previousPage = page;

    }

    ngAfterViewInit() {
        select_init();
    }

    clear() {
        this.page = 0;
        this.currentSearch = "";
        this.router.navigate([
            "/entity",
            "assurance",
            {
                page: this.page,
                sort: this.predicate + "," + (this.reverse ? "desc" : "asc")
            }
        ]);
        this.loadAll();
    }

    search(query) {

        this.currentSearch = query;
        if (!query) {
            return this.clear();
        }
        this.filtredAssureData = this.assurance.filter(function (agent) {
            return agent.name.indexOf(query) !== -1 || (agent.first_name !== null && agent.first_name.indexOf(query) !== -1) || agent.num_police.indexOf(query) !== -1;
        });
        this.totalItems = this.filtredAssureData.length;
        this.listAssurance = this.filtredAssureData.slice(0, this.itemsPerPage);
    }
    ngOnInit() {
        this.loadAll();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Assurance) {
        return item.id;
    }
    sort() {
        const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
        if (this.predicate !== "id") {
            result.push("id");
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.assurance = data;
        this.listAssurance = data.slice(0, this.itemsPerPage);
        this.totalItems = this.assurance.length;
        //console.log(this.listAssurance);
        this.loading = false;
        select_init();
    }
    private onError(error) {
        this.loading = false;
        this.alertService.error(error.message, null, null);
    }

    async ayantDroits(client: any, modal: any) {

        // let etat = await this.verifierActivationCompteCarmes(credit.chaine_compte_carmes);
        // if (!etat) return;


        this.decaisementModal = this.ngbModal.open(modal, { size: 'lg' });

        const n = document.getElementById('confirm-decaissement-modal-header').parentElement.parentElement.parentElement;
        n.style.minHeight = '0px';
        n.style.top = 'unset';
        n.style.bottom = 'unset';
        n.style.backgroundColor = 'unset';
        n.style.boxShadow = 'unset';
        this.getAyantDroit(client);

    }


    getAyantDroit(client) {
        this.assuranceService.getAyantDroit(client.num_police).subscribe((data: any) => {
            console.log(data);
            this.listAyantDroit = data;
        })
    }

}
