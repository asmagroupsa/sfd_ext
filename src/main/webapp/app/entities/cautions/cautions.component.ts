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

import { Annee } from './cautions.model';
import { AnneeService } from './cautions.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
  selector: 'jhi-cautions',
  templateUrl: './cautions.component.html'
})
export class AnneeComponent implements OnInit, OnDestroy {
  annees: Annee[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    private anneeService: AnneeService,
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
      this.anneeService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.annees = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.anneeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.annees = res.json;
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
    this.registerChangeInAnnees();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Annee) {
    return item.id;
  }
  registerChangeInAnnees() {
    this.eventSubscriber = this.eventManager.subscribe(
      'anneeListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
