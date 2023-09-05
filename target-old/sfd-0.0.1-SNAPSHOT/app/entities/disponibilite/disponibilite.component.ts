import { CreditComity } from '../credit-comity/credit-comity.model';
import { disponibilite } from '../entity.module';
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

import { Disponibilite } from './disponibilite.model';
import { DisponibiliteService } from './disponibilite.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { DelegatedMemberService } from '../delegated-member/delegated-member.service';
import { DelegatedMember } from '../delegated-member/delegated-member.model';
declare let select_init: any;
@Component({
  selector: 'jhi-disponibilite',
  templateUrl: './disponibilite.component.html',
  styles: [
    `
  th{
    border-top: none !important;
  }
  .no-dispo{
    display:none;
  }
  `
  ]
})
export class DisponibiliteComponent implements OnInit, OnDestroy {
  delegatedsmbers: DelegatedMember[];
  creditcomities: CreditComity[];
  params: any;
  currentAccount: any;
  currentComity: any;
  disponibilites: any[];
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
  onLogin: boolean = false;
  constructor(
    private disponibiliteService: DisponibiliteService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    public principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private paginationUtil: JhiPaginationUtil,
    private paginationConfig: PaginationConfig,
    public langue: LanguesService,
    private creditComityService: CreditComityService,
    private delegatedMemberService: DelegatedMemberService
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
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      this.currentComity = params['comity'];
    });
  }
  ngAfterViewInit() {
    select_init();
    this.currentComity = this.params['comity'];
  }
  comity(id: any) {
    if (!this.creditcomities) return new CreditComity();
    return this.creditcomities.find((comity: CreditComity) => {
      return comity.id == id;
    });
  }
  member(id: any) {
    if (!this.delegatedsmbers) return new DelegatedMember();
    return this.delegatedsmbers.find((mber: DelegatedMember) => {
      return mber.id == id;
    });
  }
  getComitys() {
    this.creditComityService
      .query({ size: 1000 })
      .subscribe((res: ResponseWrapper) => {
        this.creditcomities = res.json;
      });
    this.delegatedMemberService
      .query({ size: 1000 })
      .subscribe((res: ResponseWrapper) => {
        this.delegatedsmbers = res.json;
      });
  }
  addDispo() {
    if (this.principal.store['loggedComity']) {
      if (!this.params['comity'] || !this.currentComity) return;
      let disponibilite = new Disponibilite();
      disponibilite.presence = true;
      disponibilite.creditComityId =
        +this.params['comity'] || this.currentComity;
      disponibilite.delegatedMemberId = Math.floor(Math.random() * 4 + 1);
      this.disponibiliteService.create(disponibilite).subscribe(() => {
        delete this.principal.store['loggedComity'];
        this.alertService.success(
          'Votre présence a été prise en compte',
          null,
          null
        );
        this.loadAll();
      });
    } else {
      this.onLogin = true;
    }
  }
  loadAll() {
    if (this.currentSearch) {
      this.disponibiliteService
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
    if (this.currentComity) {
      this.disponibiliteService
        .queryDisponibles(this.currentComity)
        .subscribe(
          (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    /* 
    this.disponibiliteService
      .queryDisponibles(this.params['comity'] || 0)
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
        (res: ResponseWrapper) => this.onError(res.json)
      ); */
  }
  loadPage(page: number) {
    //this.page = page;
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(['/entity', 'disponibilite'], {
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
      '/entity',
      'disponibilite',
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
      '/entity',
      'disponibilite',
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
    this.getComitys();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInDisponibilites();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Disponibilite) {
    return item.id;
  }
  registerChangeInDisponibilites() {
    this.eventSubscriber = this.eventManager.subscribe(
      'disponibiliteListModification',
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
    if (headers.get('link'))
      this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    if (this.pagingParams && this.pagingParams.page) {
      //this.page = this.pagingParams.page;
    }
    this.disponibilites = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
  onChange() {
    this.disponibiliteService
      .queryDisponibles(this.currentComity)
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
        (res: ResponseWrapper) => this.onError(res.json)
      );
  }
}
