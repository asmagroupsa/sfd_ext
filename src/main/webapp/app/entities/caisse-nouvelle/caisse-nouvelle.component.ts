import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  agence:string;

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
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

  navigateToAlimenterSfd(){
    //[queryParams]="{agence:getAgence(), caisse:caisseNouvelle.compteCarmes, typeCaisse:'caisseAgence'}"
  let ag = this.getAgenceObj();
    console.log(ag);
    this.router.navigate(['/entity','caisse-nouvelle', { outlets: { popup: ['alimentation-caisse-sfd'] } }],{
      queryParams: {
        'agence': ag.comptecarmes,
        //'nameCaisse': caisse.libelle,
        'nameAgence':ag.name,
        //'caisse': caisse.compteCarmes
      }
    })
   }

  navigateToAlimenterAgence(caisse:any){
  //[queryParams]="{agence:getAgence(), caisse:caisseNouvelle.compteCarmes, typeCaisse:'caisseAgence'}"
let ag = this.getAgenceObj();
  console.log(ag);
  this.router.navigate(['/entity','caisse-nouvelle', { outlets: { popup: ['alimentation-caisse-agence'] } }],{
    queryParams: {
      'agence': ag.comptecarmes,
      'nameCaisse': caisse.libelle,
      'nameAgence':ag.name,
      'caisse': caisse.compteCarmes
    }
  })
 }

 navigateToAffecterUtilisateurCaisse(caisse:any){
    //[queryParams]="{agence:getAgence(), caisse:caisseNouvelle.compteCarmes, typeCaisse:'caisseAgence'}"
  let ag = this.getAgenceObj();
    console.log(ag);
    this.router.navigate(['/entity','caisse-nouvelle', { outlets: { popup: ['utilisateur-caisse'] } }],{
      queryParams: {
        'agence': ag.comptecarmes,
        'nameCaisse': caisse.libelle,
        'nameAgence':ag.name,
        'caisse': caisse.compteCarmes
      }
    })
   }

  getAgenceObj(){
    if(!this.agence){
      return UserData.getInstance().getCurrentOrFirstAgence();
      }else {
        for(let agence of UserData.getInstance().listeAgences){
          if(agence.codeAgence == this.agence){
            return agence;
          }
        }
      }
      return null;
  }

  getAgence(){
  let ag;
  if(!this.agence){
    ag = UserData.getInstance().getCurrentOrFirstAgence();
    if(ag) ag = ag.codeAgence;
    }else {
      ag = this.agence;
    }
    return ag;
  }

  loadAll() {
    let ag = this.getAgence();
    console.log(ag);
    console.log({
      agence:UserData.getInstance().agence,
      agencesReference:UserData.getInstance().agencesReference,
      listeAgences:UserData.getInstance().listeAgences
    });

    if (this.currentSearch) {
      this.caisseNouvelleService
        .search({
          agence_reference: ag,
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
    this.caisseNouvelleService.queryTest({
      agence_reference: ag
    }).subscribe(
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

        if (this.agences.length) {
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

  onSolde(caisse:any){
    this.alertService.success(`Le solde de la caisse ${caisse.libelle} (Référence: ${caisse.reference}) est de ${caisse.solde || 0} FCFA`);
  }
}
