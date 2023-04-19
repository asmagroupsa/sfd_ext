import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from 'ng-jhipster';

import { Commission } from './commission.model';
import { CommissionService } from './commission.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { ClientService } from '../client';

@Component({
  selector: 'jhi-commission',
  templateUrl: './commission.component.html'
})
export class CommissionComponent implements OnInit, OnDestroy {
  currentAccount: any;
  commissions: Commission[];
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
  agent: any = {};

  constructor(
    private commissionService: CommissionService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    public  principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private paginationUtil: JhiPaginationUtil,
    private paginationConfig: PaginationConfig,
    public langue: LanguesService,
    private clientService: ClientService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data['pagingParams'].page;
 this.pagingParams = data['pagingParams'];
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
      this.commissionService
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
    this.activatedRoute.queryParams.subscribe((params) => {
        if (params['t'] === 'carmes') {
            this.agent.name = params['name'];
            this._loadCommissions({cpteCarmes: params['agent']});
        }
        else if (params['agent']) {
            this.clientService.find(params['agent']).subscribe((agent) => {
                this.agent = agent;
                this._loadCommissions({cpteCarmes :this.agent.cpteCarmes});
            }, () => {
                this.agent = undefined;
                this._loadCommissions();
            });
        }
        else {
            this.agent = undefined;
            this._loadCommissions();
        }
    });
    
  }

  private _loadCommissions(query?: any) {
    this.commissionService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'carmesAccount.equals': query.cpteCarmes,
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
    this.router.navigate(['/commission'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      '/commission',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
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
      '/commission',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCommissions();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Commission) {
    return item.id;
  }
  registerChangeInCommissions() {
    this.eventSubscriber = this.eventManager.subscribe(
      'commissionListModification',
      response => this.loadAll()
    );
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(data, headers) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    if(this.pagingParams && this.pagingParams.page){
//this.page = this.pagingParams.page;
}
    this.commissions = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
