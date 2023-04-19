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

import { IdCardType } from './id-card-type.model';
import { IdCardTypeService } from './id-card-type.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';

@Component({
  selector: 'jhi-id-card-type',
  templateUrl: './id-card-type.component.html'
})
export class IdCardTypeComponent implements OnInit, OnDestroy {
  idCardTypes: IdCardType[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    private idCardTypeService: IdCardTypeService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    public  principal: Principal,
    public langue: LanguesService
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.idCardTypeService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.idCardTypes = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.idCardTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.idCardTypes = res.json;
        this.currentSearch = '';
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInIdCardTypes();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IdCardType) {
    return item.id;
  }
  registerChangeInIdCardTypes() {
    this.eventSubscriber = this.eventManager.subscribe(
      'idCardTypeListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
