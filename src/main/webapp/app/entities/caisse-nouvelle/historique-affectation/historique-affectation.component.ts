import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { DatePipe } from '@angular/common';
import { OperationCaisse, OperationCaisseService } from '../../operation-caisse';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../../shared';
import { LanguesService } from '../../../shared/myTranslation/langues';

declare let select_init: any;
@Component({
  selector: 'jhi-historique-affectation',
  templateUrl: './historique-affectation.component.html'
})
export class HistoriqueAffectationComponent implements OnInit, OnDestroy {
  operationCaisses: OperationCaisse[];
  selectedCaisse:any;
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;
  agences = [];
  caisses = [];
  agence:string;
  date1: any;
    date2: any;

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
    private operationCaisseService: OperationCaisseService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    activatedRoute: ActivatedRoute,
    private router: Router,
    public principal: Principal,
    public langue: LanguesService,
    private _datePipe: DatePipe
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.currentSearch = activatedRoute.snapshot.params['search']
      ? activatedRoute.snapshot.params['search']
      : '';
      let now = new Date();
      this.date2 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDay()};
      now.setMonth(now.getMonth() - 1);
      this.date1 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDay()};

  }
  ngAfterViewInit() {
    setTimeout(() => {
      select_init();
    }, 1200);
  }

  onPeriodChange(){
    console.log(this.date1,this.date2);
    this.loadAll();
  }

  loadCaisses() {
    if (this.currentSearch) {
      this.caisseNouvelleService
        .search({
          agence_reference: this.agence,
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => {
            console.log(res),
            this.caisses = res.json;
            if(this.caisses.length) {
              this.selectedCaisse = this.caisses[0];
              this.loadAll();

            }
          },
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.caisseNouvelleService.queryTest({
      agence_reference: this.agence
    }).subscribe(
      (res: ResponseWrapper) => {
        this.caisses = res.json;
        if(this.caisses.length){
           this.selectedCaisse = this.caisses[0];
           this.loadAll();
          }
        this.currentSearch = '';
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  loadAll() {
    const formatDate = (date)=>{
      if(!date) return null;
      return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
  }
    if (this.currentSearch) {
      this.operationCaisseService
        .search({
          date1:formatDate(this.date1),
      date2:formatDate(this.date2),
          comptecarmescaisse: this.selectedCaisse.compteCarmes,
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.operationCaisses = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.operationCaisseService.query({
      date1:formatDate(this.date1),
      date2:formatDate(this.date2),
      comptecarmescaisse: this.selectedCaisse.compteCarmes
    }).subscribe(
      (res: ResponseWrapper) => {
        this.operationCaisses = res.json;
        console.log(res.json);

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

    this.principal.identity().then(account => {
      this.currentAccount = account;
    });

    this.registerChangeInOperationCaisses();
    this.agences = UserData.getInstance().listeAgences;
    console.log(this.agences);


        if (this.agences.length) {
            this.agence = this.agences[0].codeAgence;
            this.loadCaisses();
        } else if(UserData.getInstance().agence){
          this.agence = UserData.getInstance().agence;
            this.loadCaisses();
        }
  }

  onAgenceChange(){
    this.caisses = [];
    this.operationCaisses = [];
    this.loadCaisses();
  }

  onCaisseChange(){
    this.operationCaisses = [];
    this.loadAll();
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

}
