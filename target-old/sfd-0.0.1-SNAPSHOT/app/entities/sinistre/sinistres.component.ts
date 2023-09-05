import { JhiParseLinks, JhiAlertService, JhiEventManager, JhiPaginationUtil } from 'ng-jhipster';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClientService } from '../client';
import { Principal, ITEMS_PER_PAGE, ResponseWrapper, UserData } from '../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SinistreService } from './sinistre.service';
import { Sinistre } from './sinistre';
declare const select_init: any;
@Component({
    selector: 'app-name',
    templateUrl: './sinistres.component.html',
})
export class SinistresComponent implements OnInit {
    params: { [key: string]: any };
    sinistre: any[];
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
    listSinistre = [];
    end: number;
    start: number = 0;
    filtredAssureData = [];
    loading = false;
    listAyantDroit: any[] = [];

    constructor(
        private sinistreService: SinistreService,
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
        this.sinistreService
            .query(
                // {
                //     page: this.page - 1,
                //     size: this.itemsPerPage,
                //     sort: this.sort(),
                //     'sfd_reference': (UserData.getInstance().sfd || UserData.getInstance().currentSfdReference),
                // }
                )
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
        this.router.navigate(["/sinistres"], {
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
        this.listSinistre = [];
        const interval = Math.abs(page - this.previousPage);

        if (this.previousPage < page)
            this.start = this.start + (interval * this.itemsPerPage);
        else this.start = this.start - (interval * this.itemsPerPage);

        this.end = this.start + this.itemsPerPage;

        if (this.currentSearch)
            this.listSinistre = this.filtredAssureData.slice(this.start, this.end);
        else this.listSinistre = this.sinistre.slice(this.start, this.end);

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
        this.filtredAssureData = this.sinistre.filter(function (agent) {
            return agent.name.indexOf(query) !== -1 || (agent.first_name !== null && agent.first_name.indexOf(query) !== -1) || agent.num_police.indexOf(query) !== -1;
        });
        this.totalItems = this.filtredAssureData.length;
        this.listSinistre = this.filtredAssureData.slice(0, this.itemsPerPage);
    }
    ngOnInit() {
        this.loadAll();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Sinistre) {
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
        this.sinistre = data;
        this.listSinistre = data.slice(0, this.itemsPerPage);
        this.totalItems = this.sinistre.length;
        //console.log(this.listAssurance);
        this.loading = false;
        select_init();
    }
    private onError(error) {
        this.loading = false;
        this.alertService.error(error.message, null, null);
    }
}
