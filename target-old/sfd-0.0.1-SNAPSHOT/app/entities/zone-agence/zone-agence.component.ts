import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { ZoneAgence } from './zone-agence.model';
import { ZoneAgenceService } from './zone-agence.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { AgenceService } from '../agence/agence.service';
import { UserData } from '../../shared/model/singleton';
declare let select_init: any;
declare let modal: any;
declare let modalHide: any;
@Component({
  selector: 'jhi-zone-agence',
  templateUrl: './zone-agence.component.html'
})
export class ZoneAgenceComponent implements OnInit, OnDestroy {
  isSaving: boolean;
  currentAccount: any;
  model: any = {
    agences: []
  };
  agences: any[] = [];
  zoneAgences: ZoneAgence[];
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
    private zoneAgenceService: ZoneAgenceService,
    private agenceService: AgenceService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private principal: Principal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
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
  ngAfterViewInit() {
    select_init();
  }
  loadAll() {
    if (this.currentSearch) {
      this.zoneAgenceService
        .search({
          page: this.page - 1,
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
    this.zoneAgenceService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        'sfdId.equals': UserData.getInstance().sfdId || UserData.getInstance().listeAgences[0].sfdId
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
    this.router.navigate(['/zone-agence'], {
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
      '/zone-agence',
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
      '/zone-agence',
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
    this.agenceService
      .query({
        'sfdId:equals': UserData.getInstance().sfdId || UserData.getInstance().listeAgences[0].sfdId,
        size: 1000
      })
      .subscribe(agences => {
        this.agences = agences.json;
        select_init();
      });
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInZoneAgences();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ZoneAgence) {
    return item.id;
  }
  registerChangeInZoneAgences() {
    this.eventSubscriber = this.eventManager.subscribe(
      'zoneAgenceListModification',
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
    this.zoneAgences = data;
    select_init();
  }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
  save() {
    this.isSaving = true;
  }
  closeModal(id) {
    modalHide(id);
  }
  openModal(id) {
    modal(id);
  }
}
