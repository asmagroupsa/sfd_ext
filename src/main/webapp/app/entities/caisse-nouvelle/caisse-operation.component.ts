import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  JhiEventManager,
  JhiAlertService
} from 'ng-jhipster';

import { Principal, ResponseWrapper } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';
declare let select_init: any;
@Component({
  selector: 'jhi-caisse-operation',
  templateUrl: './caisse-operation.component.html'
})
export class CaisseOperationComponent implements OnInit, OnDestroy {
  category: { id: number; name: string };
  categories: { id: number; name: string }[] = [];
  caisseNouvelles: CaisseNouvelle[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    public principal: Principal,
    public langue: LanguesService
  ) {
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
  }
  ngAfterViewInit() {
    select_init();
  }
  loadAll() {
    if (this.currentSearch) {
      this.caisseNouvelleService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.caisseNouvelles = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.caisseNouvelleService.query().subscribe(
      (res: ResponseWrapper) => {
        this.caisseNouvelles = res.json;
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
    this.categories = [
      { id: 1, name: 'Virement vers la caisse centrale' },
      { id: 2, name: 'Transferts' },
      { id: 3, name: 'Dépôts' },
      { id: 4, name: 'Retraits' },
      { id: 5, name: 'Remboursements' }
    ];
    this.category = this.categories[0];
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeIncaisseNouvelles();
  }

  ngOnDestroy() {
    if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: CaisseNouvelle) {
    return item.id;
  }
  registerChangeIncaisseNouvelles() {
    this.eventSubscriber = this.eventManager.subscribe(
      'caisseNouvelleListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
  changeCategorie(categorie: any) {
    this.category = categorie;
    select_init();
  }
}
