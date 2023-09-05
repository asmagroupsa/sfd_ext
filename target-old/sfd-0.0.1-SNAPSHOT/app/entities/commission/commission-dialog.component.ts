import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Commission } from './commission.model';
import { CommissionPopupService } from './commission-popup.service';
import { CommissionService } from './commission.service';
import { Compensation, CompensationService } from '../compensation';
import { Operation, OperationService } from '../operation';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-commission-dialog',
  templateUrl: './commission-dialog.component.html'
})
export class CommissionDialogComponent implements OnInit {
  commission: Commission;
  authorities: any[];
  isSaving: boolean;

  compensations: Compensation[];

  operations: Operation[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private commissionService: CommissionService,
    private compensationService: CompensationService,
    private operationService: OperationService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.compensationService.query().subscribe(
      (res: ResponseWrapper) => {
        this.compensations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.operationService.query().subscribe(
      (res: ResponseWrapper) => {
        this.operations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.commission.id !== undefined) {
      this.subscribeToSaveResponse(this.commissionService.update(this.commission), false);
    } else {
      this.subscribeToSaveResponse(this.commissionService.create(this.commission), true);
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Commission>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Commission) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Commission, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.commission.created' : 'carmesfnmserviceApp.commission.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'commissionListModification',
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

  trackCompensationById(index: number, item: Compensation) {
    return item.id;
  }

  trackOperationById(index: number, item: Operation) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-commission-popup',
  template: ''
})
export class CommissionPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private commissionPopupService: CommissionPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.commissionPopupService.open(
          CommissionDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.commissionPopupService.open(
          CommissionDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
