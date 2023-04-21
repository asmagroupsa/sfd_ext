import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';

declare let select_init: any;
@Component({
  selector: 'jhi-caisse-nouvelle',
  templateUrl: './caisse-nouvelle.component.html'
})
export class CaisseNouvelleComponent implements OnInit, OnDestroy {
  caisseNouvelles: any[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;
  agences = [];
  agenceReference : any;
  codeCaisse : any = '';

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
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
      this.caisseNouvelleService
        .search({
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => {
            console.log(res),
            this.caisseNouvelles = res.json
          },
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
    this.loadAll();
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCaisseNouvelles();
    this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            this.agenceReference = this.agences[0].codeAgence;
        }else if (this.agences.length > 1){
            this.agenceReference = this.agences[0].codeAgence;
        }
  }

  onAgenceChange(){
    this.caisseNouvelles = [];
    this.loadAll();
  }

  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: CaisseNouvelle) {
    return item.id;
  }
  registerChangeInCaisseNouvelles() {
    this.eventSubscriber = this.eventManager.subscribe(
      'caisseNouvelleListModification',
      response => this.loadAll()
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
