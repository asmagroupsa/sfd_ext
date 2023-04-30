import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { OperationCaisse } from './operation-caisse.model';
import { OperationCaisseService } from './operation-caisse.service';

declare let select_init: any;
@Component({
  selector: 'jhi-operation-caisse-type',
  templateUrl: './operation-caisse.component.html'
})
export class OperationCaisseComponent implements OnInit, OnDestroy {
  category: { id: number; code; name: string };
  premiereCategories: { id: number; code; name: string }[] = [];
  deuxiemeCategories: { id: number; code; name: string }[] = [];
  operationCaisses: OperationCaisse[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;

  constructor(
    private operationCaisseService: OperationCaisseService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    activatedRoute: ActivatedRoute,
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
      this.operationCaisseService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.operationCaisses = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.operationCaisseService.query().subscribe(
      (res: ResponseWrapper) => {
        this.operationCaisses = res.json;
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
    this.premiereCategories = [
        { id: 1, code: 'VIREMENT', name: 'Virement caisse à caisse' },
        { id: 2, code: 'DEPOT', name: 'Dépôts' },
        { id: 3, code: 'RETRAIT', name: 'Retraits' }
      ];
      this.deuxiemeCategories = [
        { id: 4, code: 'COMPTEEPARGNE', name: 'Ouverture compte épargne' },
        { id: 5, code: 'ENCAISSEMENT', name: 'Encaissement Divers' },
        { id: 6, code: 'DECAISSEMENT', name: 'Décaissement Divers' },
      ];
      this.category = this.premiereCategories[0];
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOperationCaisses();
  }

  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: OperationCaisse) {
    return item.id;
  }
  registerChangeInOperationCaisses() {
    this.eventSubscriber = this.eventManager.subscribe(
      'operationCaisseListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
  changeCategorie(categorie: any) {
    this.category = categorie;
    console.log(this.category);

    select_init();
  }
}
