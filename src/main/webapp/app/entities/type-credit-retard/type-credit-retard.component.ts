import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { TypeCreditRetard } from './type-credit-retard.model';
import { TypeCreditRetardService } from './type-credit-retard.service';

declare let select_init: any;
@Component({
  selector: 'jhi-type-credit-retard',
  templateUrl: './type-credit-retard.component.html'
})
export class TypeCreditRetardComponent implements OnInit, OnDestroy {
  typeCreditRetards: TypeCreditRetard[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;

  constructor(
    private typeCreditRetardService: TypeCreditRetardService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private cdr: ChangeDetectorRef,
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
      this.typeCreditRetardService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => {
            console.log(res),
            this.typeCreditRetards = res.json
          },
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.typeCreditRetardService.query().subscribe(
      (res: ResponseWrapper) => {
        this.typeCreditRetards = res.json;
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
    this.registerChangeInTypeCreditRetards();
  }

  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: TypeCreditRetard) {
    return item.id;
  }
  registerChangeInTypeCreditRetards() {
    this.eventSubscriber = this.eventManager.subscribe(
      'typeCreditRetardListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
