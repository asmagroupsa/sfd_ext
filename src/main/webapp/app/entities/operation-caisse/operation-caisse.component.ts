import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { OperationCaisse } from './operation-caisse.model';
import { OperationCaisseService } from './operation-caisse.service';
import { CaisseNouvelleService } from '../caisse-nouvelle';
import { DatePipe } from '@angular/common';

declare let select_init: any;
@Component({
  selector: 'jhi-operation-caisse-type',
  templateUrl: './operation-caisse.component.html'
})
export class OperationCaisseComponent implements OnInit, OnDestroy {
  category: { id: number; code; name: string };
  troisiemeCategories: { id: number; code; name: string }[] = [];
  premiereCategories: { id: number; code; name: string }[] = [];
  deuxiemeCategories: { id: number; code; name: string }[] = [];
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
      this.date2 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
      now.setMonth(now.getMonth() - 1);
      this.date1 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
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
    this.troisiemeCategories = [
      //{ id: 1, code: 'VIREMENT', name: 'Virement caisse à caisse' },
      { id: 11, code: 'SOLDE', name: 'Voir le solde de la caisse' },
      { id: 11, code: 'ARRETE_CAISSE', name: 'Arreté de caisse' }
    ];

    this.premiereCategories = [
        { id: 4, code: 'COMPTEEPARGNE', name: 'Ouverture Compte Epargne' },
        { id: 44, code: 'COMPTEDAT', name: 'Ouverture Compte DAT' },
      ];

      this.deuxiemeCategories = [
        { id: 2, code: 'DEPOT', name: 'Dépôts'},
        { id: 3, code: 'RETRAIT', name: 'Retraits'},
        { id: 5, code: 'ENCAISSEMENT', name: 'Encaissement Divers' },
        { id: 6, code: 'DECAISSEMENT', name: 'Décaissement Divers' },
      ];
      // this.category = this.premiereCategories[0];

    this.principal.identity().then(account => {
      this.currentAccount = account;
    });

    this.registerChangeInOperationCaisses();
    this.agences = UserData.getInstance().listeAgences;

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

  changeCategorie(categorie: any) {
    this.category = categorie;
    select_init();
    if(!this.selectedCaisse){
      alert('Veuillez selectionner la caisse');
      return ;
    }

    if(this.category.code == 'SOLDE'){
      this.alertService.success(`Le solde de la caisse ${this.selectedCaisse.libelle} (Référence: ${this.selectedCaisse.reference}) est de ${this.selectedCaisse.solde || 0} FCFA`);
      return ;
    } else if(this.category.code == 'ARRETE_CAISSE'){
      let now = new Date();
      now.setDate(now.getDate() + 1);
      this.date2 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
      now = new Date();
      this.date1 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
      this.loadAll();
      return;
    }

    this.router.navigate(['/entity','operation-caisse', { outlets: { popup:
      ['operation-caisse-new'] } }], {
        queryParams:{
          type: categorie.code,
          agence: this.agence,
          caisseName: this.selectedCaisse.libelle,
          caisse: this.selectedCaisse.compteCarmes
        }
      });
  }
}
