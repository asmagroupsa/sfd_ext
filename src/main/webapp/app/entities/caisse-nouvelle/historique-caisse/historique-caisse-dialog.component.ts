import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HistoriqueUtilisateurCaissePopupService } from './historique-caisse-popup.service';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';
import { LanguesService } from '../../../shared/myTranslation/langues';
import { ResponseWrapper, UserData } from '../../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-utilisateur-caisse-dialog',
  templateUrl: './utilisateur-caisse-dialog.component.html'
})
export class HistoriqueUtilisateurCaisseDialogComponent implements OnInit {
  historiques:any[]= [];
  authorities: any[];
  isSaving: boolean;
  agences = [];
  nameCaisse:string;
  agence:string;
  caisse:string;
  date1: any;
  date2: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager,
    public langue: LanguesService,
    activatedRoute: ActivatedRoute,
    private caisseNouvelleService: CaisseNouvelleService,
  ) {
    this.nameCaisse = activatedRoute.snapshot.queryParams['nameCaisse'];
    this.agence = activatedRoute.snapshot.queryParams['agence'];
    this.caisse = activatedRoute.snapshot.queryParams['caisse'];
    //console.log(this.activatedRoute.snapshot.queryParams);
   }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.caisseNouvelleService.getHistorique({
      'caisse':this.caisse,
      agence_reference: this.agence,
date1:this.date1,
date2: this.date2
    }).subscribe(
      (res: ResponseWrapper) => {
        console.log(res),
        this.historiques = res.json
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
  }

  private subscribeToSaveResponse(
    result: Observable<any>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: any) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: any, isCreated: boolean) {
    if(result.resultat != 'OK'){
      let msg:string = "Une erreur s'est produite";
      switch(result.resultat){
        case 'COMPTE_CAISSE_ERRONEE':
          msg = "Le compte Carmes de la caisse est erronné";
          break;
        case 'COMPTE_AGENCE_ERRONEE':
          msg = "Le compte Carmes de l'agence est erronné";
          break;
        case 'SOLDE INSUFFISANT':
          msg = "Le solde est insuffisant";
          break;
      }
      this.isSaving = false;
      this.alertService.error(msg, null, null);
    return ;
    }
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.utilisateurCaisse.created' : 'carmesfnmserviceApp.utilisateurCaisse.updated',
      { param: result.id },
      null
    );
    this.eventManager.broadcast({
      name: 'utilisateurCaisseListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError(error) {
    try {
      error.json();
    } catch (exception) {
      error.message = error.text();
    }
    this.isSaving = false;
    this.onError(error);
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

@Component({
  selector: 'jhi-utilisateur-caisse-popup',
  template: ''
})
export class HistoriqueUtilisateurCaissePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private utilisateurCaissePopupService: HistoriqueUtilisateurCaissePopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.utilisateurCaissePopupService.open(
            HistoriqueUtilisateurCaisseDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.utilisateurCaissePopupService.open(
            HistoriqueUtilisateurCaisseDialogComponent as Component
          );
        }
      });
    // } else {
    //   window.history.back();
    // }
  }

  ngOnDestroy() {
    if (this.routeSub)
      this.routeSub.unsubscribe();
  }
}