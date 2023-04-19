import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TauxCommission } from './taux-commission.model';
import { TauxCommissionPopupService } from './taux-commission-popup.service';
import { TauxCommissionService } from './taux-commission.service';

@Component({
  selector: 'jhi-taux-commission-dialog',
  templateUrl: './taux-commission-dialog.component.html',
  styles: [
    `
      select{


       height: 50px;
       font-size:15px;
border:none;
border-bottom:1.5px solid;
      }
       `
  ]
})
export class TauxCommissionDialogComponent implements OnInit {
  tauxCommission: TauxCommission;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private tauxCommissionService: TauxCommissionService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.tauxCommission.id !== undefined) {
      this.subscribeToSaveResponse(
        this.tauxCommissionService.update(this.tauxCommission),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.tauxCommissionService.create(this.tauxCommission),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TauxCommission>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TauxCommission) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TauxCommission, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.tauxCommission.created'
        : 'carmesfnmserviceApp.tauxCommission.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'tauxCommissionListModification',
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
}

@Component({
  selector: 'jhi-taux-commission-popup',
  template: ''
})
export class TauxCommissionPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tauxCommissionPopupService: TauxCommissionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.tauxCommissionPopupService.open(
          TauxCommissionDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.tauxCommissionPopupService.open(
          TauxCommissionDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
