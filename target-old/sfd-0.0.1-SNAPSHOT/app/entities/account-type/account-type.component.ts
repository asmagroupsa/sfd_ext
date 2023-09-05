import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { AccountType } from './account-type.model';
import { AccountTypeService } from './account-type.service';

declare let select_init: any;
@Component({
  selector: 'jhi-account-type',
  templateUrl: './account-type.component.html'
})
export class AccountTypeComponent implements OnInit, OnDestroy {
  accountTypes: AccountType[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;

  constructor(
    private accountTypeService: AccountTypeService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    public principal: Principal,
    public langue: LanguesService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
  }
  ngAfterViewInit() {
    setTimeout(() => {
      select_init();
    }, 1200);
  }
  loadAll() {
    if (this.currentSearch) {
      this.accountTypeService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.accountTypes = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.accountTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.accountTypes = res.json;
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
    this.registerChangeInAccountTypes();
  }

  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: AccountType) {
    return item.id;
  }
  registerChangeInAccountTypes() {
    this.eventSubscriber = this.eventManager.subscribe(
      'accountTypeListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
