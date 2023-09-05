import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy, numberToLocalString } from '../../shared/model/functions';
import { TypesContrat } from './types-contrat.model';
import { TypesContratPopupService } from './types-contrat-popup.service';
import { TypesContratService } from './types-contrat.service';
import { ResponseWrapper, LOCAL_FLAG } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-types-contrat-dialog',
  templateUrl: './types-contrat-dialog.component.html'
})
export class TypesContratDialogComponent implements OnInit {
  typesContrat: TypesContrat;
  authorities: any[];
  isSaving: boolean;

  
  createdDateDp: any;
  lastModifiedDateDp: any;


  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private typesContratService: TypesContratService,
   
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {

    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
   
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.principal.identity().then(
      (identity: any) => {
        if (this.typesContrat.id !== undefined) {
          setLastModifyBy(this.typesContrat, identity);

          this.subscribeToSaveResponse(
            this.typesContratService.update(this.typesContrat),
            false
          );
        } else {
          setCreateBy(this.typesContrat, identity);
         
          this.subscribeToSaveResponse(
            this.typesContratService.create(this.typesContrat),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<TypesContrat>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TypesContrat) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TypesContrat, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.typesContrat.created' : 'carmesfnmserviceApp.typesContrat.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'typesContratListModification',
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
  /* controlForm(editForm: NgForm) {
    if (
      !editForm ||
      !editForm.controls ||
      !editForm.controls.typeValeur ||
      !editForm.controls.amount
    )
      return false;
    if (
      editForm.controls.typeValeur.value == 'TAUX' &&
      (editForm.controls.amount.value >= 0 &&
        editForm.controls.amount.value <= 100)
    )
      return true;
    else if (
      editForm.controls.typeValeur.value == 'types Contrat' &&
      editForm.controls.amount.value > 0
    )
      return true;
    else if (editForm.controls.typeValeur.value == 'AUCUN') return true;
    else return false;
  } */
}

@Component({
  selector: 'jhi-types-contrat-popup',
  template: ''
})
export class TypesContratPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typesContratPopupService: TypesContratPopupService
  ) {}

  ngOnInit() {
   /*  if(LOCAL_FLAG){ */
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.typesContratPopupService.open(
          TypesContratDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.typesContratPopupService.open(TypesContratDialogComponent as Component);
      }
    });
   /*  } else {
            window.history.back();
        } */
  }

  ngOnDestroy() {
    if(this.routeSub)
    this.routeSub.unsubscribe();
  }
}
