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

import { SituationMat } from './situation-mat.model';
import { SituationMatService } from './situation-mat.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
  selector: 'jhi-situation-mat',
  templateUrl: './situation-mat.component.html'
})
export class SituationMatComponent implements OnInit, OnDestroy {
  situationMats: SituationMat[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    private situationMatService: SituationMatService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    public principal: Principal
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.situationMatService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.situationMats = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.situationMatService.query().subscribe(
      (res: ResponseWrapper) => {
        this.situationMats = res.json;
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
    this.registerChangeInSituationMats();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: SituationMat) {
    return item.id;
  }
  registerChangeInSituationMats() {
    this.eventSubscriber = this.eventManager.subscribe(
      'situationMatListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
