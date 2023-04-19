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

import { LigneRequest } from './ligne-request.model';
import { LigneRequestService } from './ligne-request.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { UserData } from '../../shared/model/singleton';

@Component({
  selector: 'jhi-ligne-request',
  templateUrl: './ligne-request.component.html'
})
export class LigneRequestComponent implements OnInit, OnDestroy {
  currentAccount: any;
  ligneRequests: LigneRequest[];
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

  constructor(
    private ligneRequestService: LigneRequestService,
    private parseLinks: JhiParseLinks,
    private alertService: JhiAlertService,
    public principal: Principal,
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
      this.pagingParams = data['pagingParams'];
      this.previousPage = data['pagingParams'].page;
      this.reverse = data['pagingParams'].ascending;
      this.predicate = data['pagingParams'].predicate;
    });
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
  }
levelDossier(ligneRequest:LigneRequest):string{
        if (!ligneRequest.affectedTo) return '';
     if(ligneRequest.affectedTo.indexOf('LIGNE_CREDIT') != -1)
       return 'La demande est décaissée';
     if(ligneRequest.affectedTo.indexOf('VALIDER') != -1)
       return 'La demande est déjà validée';
       if(ligneRequest.affectedTo.indexOf('COMITE') != -1)
       return 'La demande est au comité';
       let lastStep:any = ligneRequest.affectedTo.split(',');
       lastStep = lastStep[lastStep.length -1];
       lastStep = lastStep.replace(/-/g,'');
       return `au niveau du <strong>${lastStep}</strong>`;
    }
  loadAll() {
    if (this.currentSearch) {
      this.ligneRequestService
        .search({
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort(),
          'sfdId.equals': UserData.getInstance().sfdId
        })
        .subscribe(
          (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.ligneRequestService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
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
    this.router.navigate(['/ligne-request'], {
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
      '/ligne-request',
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
      '/ligne-request',
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
    this.registerChangeInLigneRequests();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: LigneRequest) {
    return item.id;
  }
  registerChangeInLigneRequests() {
    this.eventSubscriber = this.eventManager.subscribe(
      'ligneRequestListModification',
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
    if (this.pagingParams && this.pagingParams.page) {
      //this.page = this.pagingParams.page;
    }
    this.ligneRequests = data;
  }
  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
