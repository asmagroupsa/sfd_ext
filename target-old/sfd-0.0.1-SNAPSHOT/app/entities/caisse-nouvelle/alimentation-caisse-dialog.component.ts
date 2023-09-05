import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CaisseNouvelleService } from './caisse-nouvelle.service';
import { UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { AlimentationCaisse } from './alimentation-caisse.model';
import { AlimentationCaissePopupService } from './alimentation-caisse-popup.service';
declare let select_init: any;
@Component({
  selector: 'jhi-alimentation-caisse-dialog',
  templateUrl: './alimentation-caisse-dialog.component.html'
})
export class AlimmentationCaisseDialogComponent implements OnInit {
  alimentationCaisse: AlimentationCaisse;
  authorities: any[];
  isSaving: boolean;
  agences = [];
  nameCaisse:string;
  nameAgence:string;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private caisseNouvelleService: CaisseNouvelleService,
    private eventManager: JhiEventManager,
    public langue: LanguesService,
    activatedRoute: ActivatedRoute
  ) {
    this.alimentationCaisse= new AlimentationCaisse();
    this.alimentationCaisse.comptecarmeagence = activatedRoute.snapshot.queryParams['agence'];
    this.alimentationCaisse.comptecarmescaisse = activatedRoute.snapshot.queryParams['caisse'];
    this.nameCaisse = activatedRoute.snapshot.queryParams['nameCaisse'];
    this.nameAgence = activatedRoute.snapshot.queryParams['nameAgence'];
    //console.log(this.activatedRoute.snapshot.queryParams);
   }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            //this.alimentationCaisse.agenceReference = this.agences[0].codeAgence;
        }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.alimentationCaisse.id !== undefined) {
        this.subscribeToSaveResponse(
            this.caisseNouvelleService.alimenterCaisseAgence(this.alimentationCaisse),
            false
          );
    } else {
      this.subscribeToSaveResponse(
        this.caisseNouvelleService.alimenterCaisseAgence(this.alimentationCaisse),
        true
      );
    }
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
      isCreated ? 'carmesfnmserviceApp.alimentationCaisse.created' : 'carmesfnmserviceApp.alimentationCaisse.updated',
      { param: result.id },
      null
    );
    this.eventManager.broadcast({
      name: 'alimentationCaisseListModification',
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
  selector: 'jhi-alimentation-caisse-popup',
  template: ''
})
export class AlimentationCaissePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private alimentationCaissePopupService: AlimentationCaissePopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.alimentationCaissePopupService.open(
            AlimmentationCaisseDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.alimentationCaissePopupService.open(
            AlimmentationCaisseDialogComponent as Component
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
