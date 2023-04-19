import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Conditions } from './conditions.model';
import { ConditionsPopupService } from './conditions-popup.service';
import { ConditionsService } from './conditions.service';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-conditions-dialog',
  templateUrl: './conditions-dialog.component.html'
})
export class ConditionsDialogComponent implements OnInit {
  conditions: Conditions;
  authorities: any[];
  isSaving: boolean;

  produits: Produit[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private conditionsService: ConditionsService,
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
        if (this.conditions.id !== undefined) {
          setLastModifyBy(this.conditions, identity);
          //this.conditions.lastModifiedBy = identity.firstName || '';
          //this.conditions.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.conditionsService.update(this.conditions),
            false
          );
        } else {
          setCreateBy(this.conditions, identity);
          //this.conditions.createdBy = identity.firstName || '';
          //this.conditions.createdBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.conditionsService.create(this.conditions),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Conditions>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Conditions) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Conditions, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.conditions.created' : 'carmesfnmserviceApp.conditions.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'conditionsListModification',
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
  selector: 'jhi-conditions-popup',
  template: ''
})
export class ConditionsPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private conditionsPopupService: ConditionsPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.conditionsPopupService.open(
          ConditionsDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.conditionsPopupService.open(
          ConditionsDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
