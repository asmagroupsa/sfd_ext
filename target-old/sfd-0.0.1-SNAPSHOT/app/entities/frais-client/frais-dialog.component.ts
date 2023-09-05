import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy, numberToLocalString } from '../../shared/model/functions';
import { Frais } from './frais.model';
import { FraisPopupService } from './frais-popup.service';
import { FraisService } from './frais.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-frais-dialog',
  templateUrl: './frais-dialog.component.html'
})
export class FraisDialogComponent implements OnInit {
  frais: Frais;
  authorities: any[];
  isSaving: boolean;

  produits: Produit[];
  createdDateDp: any;
  lastModifiedDateDp: any;
  fraisAmount: string;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private fraisService: FraisService,
    private produitService: ProduitService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    if (this.frais.id) this.fraisAmount = numberToLocalString(this.frais.amount.toString());

    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.produitService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.produits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.principal.identity().then(
      (identity: any) => {
        if (this.frais.id !== undefined) {
          setLastModifyBy(this.frais, identity);
          this.subscribeToSaveResponse(
            this.fraisService.update(this.frais),
            false
          );
        } else {
          setCreateBy(this.frais, identity);
          this.frais.sfdReference = UserData.getInstance().getSFDReference();
          this.subscribeToSaveResponse(
            this.fraisService.create(this.frais),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Frais>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Frais) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Frais, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.frais.created' : 'carmesfnmserviceApp.frais.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'fraisListModification',
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

  trackProduitById(index: number, item: Produit) {
    return item.id;
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
  controlForm(editForm: NgForm) {
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
      editForm.controls.typeValeur.value == 'FRAIS' &&
      editForm.controls.amount.value > 0
    )
      return true;
    else if (editForm.controls.typeValeur.value == 'AUCUN') return true;
    else return false;
  }
}

@Component({
  selector: 'jhi-frais-popup',
  template: ''
})
export class FraisPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisPopupService: FraisPopupService
  ) {}

  ngOnInit() {
    // if(LOCAL_FLAG){
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.fraisPopupService.open(
          FraisDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.fraisPopupService.open(FraisDialogComponent as Component);
      }
    });
    // } else {
    //         window.history.back();
    //     }
  }

  ngOnDestroy() {
    if(this.routeSub)
    this.routeSub.unsubscribe();
  }
}
