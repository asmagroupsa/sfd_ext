import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CaisseNouvelleStatut } from './caisse-nouvelle-statut.model';
import { CaisseNouvelleStatutPopupService } from './caisse-nouvelle-statut-popup.service';
declare let select_init: any;
@Component({
  selector: 'jhi-caisse-nouvelle-statut-dialog',
  templateUrl: './caisse-nouvelle-statut-dialog.component.html'
})
export class CaisseNouvelleStatutDialogComponent implements OnInit {
  caisseNouvelleStatut: CaisseNouvelleStatut;
  authorities: any[];
  isSaving: boolean;
  agences = [];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private caisseNouvelleService: CaisseNouvelleService,
    private eventManager: JhiEventManager,
    public langue: LanguesService
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.agences = UserData.getInstance().listeAgences;

        if (this.agences.length == 1) {
            //this.caisseNouvelle.agenceReference = this.agences[0].codeAgence;
        }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    /* if (this.caisseNouvelleStatut.id !== undefined) {
      this.subscribeToSaveResponse(
        this.caisseNouvelleService.statutCaisse(this.caisseNouvelleStatut),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.caisseNouvelleService.statutCaisse(this.caisseNouvelleStatut),
        true
      );
    } */

    this.subscribeToSaveResponse(
        this.caisseNouvelleService.statutCaisse(this.caisseNouvelleStatut),
        true
      );
  }

  private subscribeToSaveResponse(
    result: Observable<any>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: CaisseNouvelle) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CaisseNouvelleStatut, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.caisseNouvelle.created' : 'carmesfnmserviceApp.caisseNouvelle.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'caisseNouvelleListModification',
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
  selector: 'jhi-caisse-nouvelle-statut-popup',
  template: ''
})
export class CaisseNouvelleStatutPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private caisseNouvellePopupService: CaisseNouvelleStatutPopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.caisseNouvellePopupService.open(
            CaisseNouvelleStatutDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.caisseNouvellePopupService.open(
            CaisseNouvelleStatutDialogComponent as Component
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
