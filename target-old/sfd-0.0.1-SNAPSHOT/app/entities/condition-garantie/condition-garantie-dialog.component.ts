import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { ConditionGarantie } from './condition-garantie.model';
import { ConditionGarantiePopupService } from './condition-garantie-popup.service';
import { ConditionGarantieService } from './condition-garantie.service';
import { TypeGarantie, TypeGarantieService } from '../type-garantie';
import { ResponseWrapper, Principal } from '../../shared';

@Component({
  selector: 'jhi-condition-garantie-dialog',
  templateUrl: './condition-garantie-dialog.component.html'
})
export class ConditionGarantieDialogComponent implements OnInit {
  conditionGarantie: ConditionGarantie;
  authorities: any[];
  isSaving: boolean;

  typegaranties: TypeGarantie[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private conditionGarantieService: ConditionGarantieService,
    private typeGarantieService: TypeGarantieService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.typeGarantieService.query().subscribe(
      (res: ResponseWrapper) => {
        this.typegaranties = res.json;
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
        if (this.conditionGarantie.id !== undefined) {
          setLastModifyBy(this.conditionGarantie, identity);
          //this.conditionGarantie.lastModifiedBy = identity.firstName || '';
          //this.conditionGarantie.lastModifiedBy +=
          //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.conditionGarantieService.update(this.conditionGarantie),
            false
          );
        } else {
          setCreateBy(this.conditionGarantie, identity);
          //this.conditionGarantie.createdBy = identity.firstName || '';
          //this.conditionGarantie.createdBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.conditionGarantieService.create(this.conditionGarantie),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<ConditionGarantie>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: ConditionGarantie) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: ConditionGarantie, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.conditionGarantie.created'
        : 'carmesfnmserviceApp.conditionGarantie.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'conditionGarantieListModification',
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

  trackTypeGarantieById(index: number, item: TypeGarantie) {
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
  selector: 'jhi-condition-garantie-popup',
  template: ''
})
export class ConditionGarantiePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private conditionGarantiePopupService: ConditionGarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.conditionGarantiePopupService.open(
          ConditionGarantieDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.conditionGarantiePopupService.open(
          ConditionGarantieDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
