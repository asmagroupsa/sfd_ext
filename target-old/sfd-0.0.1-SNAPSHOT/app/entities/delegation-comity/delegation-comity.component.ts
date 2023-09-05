import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper,READFILEURL } from '../../shared';
import { UserData } from '../../shared/model/singleton';
import { LanguesService } from '../../shared/myTranslation/langues';
import { DelegatedMember } from '../delegated-member/delegated-member.model';
import { DelegatedMemberService } from '../delegated-member/delegated-member.service';
import { DelegationComity } from './delegation-comity.model';
import { DelegationComityService } from './delegation-comity.service';

declare const select_init: any;

@Component({
    selector: "jhi-delegation-comity",
    templateUrl: "./delegation-comity.component.html"
})
export class DelegationComityComponent implements OnInit, OnDestroy, AfterViewInit {
    delegateds: DelegatedMember[];
    currentDelegation: DelegationComity;
    currentAccount: any;
    delegationComities: DelegationComity[];
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

    constructor(
        private delegationComityService: DelegationComityService,
        private delegatedComityService: DelegatedMemberService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        private principal: Principal,
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
    getDoc(url: string): string {
        return READFILEURL + `${url}`;
    }
    showDelegation(delegationComity: DelegationComity) {
        this.currentDelegation = delegationComity;
    }
    getDelagatedMembers() {
        this.delegatedComityService.query().subscribe((res: ResponseWrapper) => {
            this.delegateds = res.json;
        });
    }
    loadAll() {
        if (this.currentSearch) {
            this.delegationComityService
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
        }
        this.delegationComityService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
                'sfdReference.equals': UserData.getInstance().currentSfdReference
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
        this.router.navigate(["/entity", "delegation-comity"], {
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
            "delegation-comity",
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
            "delegation-comity",
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
        // this.getDelagatedMembers();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInDelegationComities();
        select_init();
    }

    ngAfterViewInit() {
        select_init();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: DelegationComity) {
        return item.id;
    }
    registerChangeInDelegationComities() {
        this.eventSubscriber = this.eventManager.subscribe(
            "delegationComityListModification",
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
        this.delegationComities = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
