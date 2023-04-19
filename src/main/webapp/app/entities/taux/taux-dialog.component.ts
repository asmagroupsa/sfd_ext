import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Taux } from './taux.model';
import { TauxPopupService } from './taux-popup.service';
import { TauxService } from './taux.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-taux-dialog',
  templateUrl: './taux-dialog.component.html'
})
export class TauxDialogComponent implements OnInit {
  taux: Taux;
  authorities: any[];
  isSaving: boolean;

  produits: Produit[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private tauxService: TauxService,
    private produitService: ProduitService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.produitService.query().subscribe(
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
        if (this.taux.id !== undefined) {
          setLastModifyBy(this.taux, identity);
          //this.taux.lastModifiedBy = identity.firstName || '';
          //this.taux.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.tauxService.update(this.taux),
            false
          );
        } else {
          setCreateBy(this.taux, identity);
          //this.taux.createdBy = identity.firstName || '';
          //this.taux.createdBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.tauxService.create(this.taux),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Taux>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Taux) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Taux, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.taux.created' : 'carmesfnmserviceApp.taux.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'tauxListModification',
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
}

@Component({
  selector: 'jhi-taux-popup',
  template: ''
})
export class TauxPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tauxPopupService: TauxPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.tauxPopupService.open(
          TauxDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.tauxPopupService.open(TauxDialogComponent);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
