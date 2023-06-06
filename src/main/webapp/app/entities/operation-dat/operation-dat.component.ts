import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { OperationDat } from './operation-dat.model';
import { OperationDatService } from './operation-dat.service';
import { CaisseNouvelleService } from '../caisse-nouvelle';
import { DatePipe } from '@angular/common';

declare let select_init: any;
@Component({
  selector: 'jhi-operation-dat-type',
  templateUrl: './operation-dat.component.html'
})
export class OperationDatComponent implements OnInit, OnDestroy {
  category: { id: number; code; name: string };
  premiereCategories: { id: number; code; name: string }[] = [];
  deuxiemeCategories: { id: number; code; name: string }[] = [];
  compteDats: OperationDat[];
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
    private operationDatService: OperationDatService,
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
    const formatDate = (date) => {
      if(!date) return null;
      return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
    }
    if (this.currentSearch) {
      this.operationDatService
        .search({
          date1:formatDate(this.date1),
          date2:formatDate(this.date2),
          comptecarmescaisse: this.selectedCaisse.compteCarmes,
          query: this.currentSearch
        })
        .subscribe(
          (res: ResponseWrapper) => (this.compteDats = res.json),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
    this.operationDatService.query({
      date1:formatDate(this.date1),
      date2:formatDate(this.date2),
      comptecarmescaisse: this.selectedCaisse.compteCarmes
    }).subscribe(
      (res: ResponseWrapper) => {
        this.compteDats = res.json;
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

    this.premiereCategories = [
        //{ id: 4, code: 'COMPTEEPARGNE', name: 'Ouverture Compte Epargne' },
        { id: 44, code: 'COMPTEDAT', name: 'Ouverture Compte DAT' }
      ];

      this.deuxiemeCategories = [
        { id: 2, code: 'DEPOT', name: 'Ajout DAT'},
        { id: 3, code: 'RUPTURE', name: 'Rupture DAT'}
      ];
      // this.category = this.premiereCategories[0];

    this.principal.identity().then(account => {
      this.currentAccount = account;
    });

    this.registerChangeInOperationDats();
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
    this.compteDats = [];
    this.loadCaisses();
  }

  onCaisseChange(){
    this.compteDats = [];
    this.loadAll();
  }


  ngOnDestroy() {
    if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: OperationDat) {
    return item.id;
  }
  registerChangeInOperationDats() {
    this.eventSubscriber = this.eventManager.subscribe(
      'operationDatListModification',
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
console.log(this.category);
    this.router.navigate(['/entity','operation-dat', { outlets: { popup:
      ['operation-dat-new'] } }], {
        queryParams:{
          type: categorie.code,
          agence: this.agence,
          caisseName: this.selectedCaisse.libelle,
          caisse: this.selectedCaisse.compteCarmes
        }
      }).catch((e) => {
        console.log(e);
      });
  }
  onSolde(compte:any) {
    this.alertService.success(`Le solde du compte ${compte.num_account} (Référence: ${compte.reference}) est de ${compte.solde || 0} FCFA`);
  }

  navigateTo(compte:any,type:string){
    //[queryParams]="{agence:getAgence(), caisse:caisseNouvelle.compteCarmes, typeCaisse:'caisseAgence'}"
  //let ag = this.getAgenceObj();
    //console.log(ag);
    this.router.navigate(['/entity','operation-dat', { outlets: { popup: ['operation-dat-new'] } }],{
      queryParams: {
        type: type,
          agence: this.agence,
          compte: compte.num_account,
          client: compte.client,
          caisseName: this.selectedCaisse.libelle,
          caisse: this.selectedCaisse.compteCarmes
      }
    })
   }
}
