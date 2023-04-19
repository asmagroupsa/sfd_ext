import {UserData} from '../../shared/model/singleton';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import {BankAccountClient} from './bank-account-client.model';
import {BankAccountClientService} from './bank-account-client.service';
import {ITEMS_PER_PAGE, Principal, ResponseWrapper} from '../../shared';
import {PaginationConfig} from '../../blocks/config/uib-pagination.config';
import {LanguesService} from '../../shared/myTranslation/langues';

@Component({
    selector: 'jhi-bank-account-client',
    templateUrl: './bank-account-client.component.html'
})
export class BankAccountClientComponent implements OnInit, OnDestroy {
    currentAccount: any;
    banks: BankAccountClient[];
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
        private bankService: BankAccountClientService,
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
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.bankService
                .search({
                    page: this.page - 1,
                    query: this.currentSearch,
                    size: this.itemsPerPage,
                    sort: this.sort()
                })
                .subscribe(
                    (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                    (res: ResponseWrapper) => this.onError(res)
                );
            return;
        }
        this.bankService
        .query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            'createdBy.equals': UserData.getInstance().userReference
        })
        .subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/bank'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/bank',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
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
            '/bank',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInBanks();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BankAccountClient) {
        return item.id;
    }
    registerChangeInBanks() {
        this.eventSubscriber = this.eventManager.subscribe(
            'bankListModification',
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.banks = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
