import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { OperationCaisse } from './operation-caisse.model';
import { OperationCaisseService } from './operation-caisse.service';
import { CaisseNouvelleService } from '../caisse-nouvelle';

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
  selectedCaisse:any;
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  itemsPerPage: number;
  agences = [];
  caisses = [];
  agence:string;

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
    private operationCaisseService: OperationCaisseService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    activatedRoute: ActivatedRoute,
    private router: Router,
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
    if (this.currentSearch) {
      this.operationCaisseService
        .search({
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
      comptecarmescaisse: this.selectedCaisse.compteCarmes
    }).subscribe(
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
      // this.category = this.premiereCategories[0];
  
    this.principal.identity().then(account => {
      this.currentAccount = account;
    });
    
    this.registerChangeInOperationCaisses();
    this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length) {
            this.agence = this.agences[0].codeAgence;
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
    this.router.navigate(['/entity','operation-caisse', { outlets: { popup:
      ['operation-caisse-new'] } }],{
        queryParams:{
          type: categorie.code,
          agence: this.agence,
          caisseName: this.selectedCaisse.libelle,
          caisse: this.selectedCaisse.compteCarmes
        },
        

      });
  }
}
