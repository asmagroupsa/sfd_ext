import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CreditRequestStatus } from './credit-request-status.model';
import { CreditRequestStatusPopupService } from './credit-request-status-popup.service';
import { CreditRequestStatusService } from './credit-request-status.service';

@Component({
  selector: 'jhi-credit-request-status-dialog',
  templateUrl: './credit-request-status-dialog.component.html',
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
export class CreditRequestStatusDialogComponent implements OnInit {
  creditRequestStatus: CreditRequestStatus;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private creditRequestStatusService: CreditRequestStatusService,
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
    if (this.creditRequestStatus.id !== undefined) {
      this.subscribeToSaveResponse(
        this.creditRequestStatusService.update(this.creditRequestStatus),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.creditRequestStatusService.create(this.creditRequestStatus),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<CreditRequestStatus>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: CreditRequestStatus) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CreditRequestStatus, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.creditRequestStatus.created'
        : 'carmesfnmserviceApp.creditRequestStatus.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'creditRequestStatusListModification',
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
  selector: 'jhi-credit-request-status-popup',
  template: ''
})
export class CreditRequestStatusPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private creditRequestStatusPopupService: CreditRequestStatusPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.creditRequestStatusPopupService.open(
          CreditRequestStatusDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.creditRequestStatusPopupService.open(
          CreditRequestStatusDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
