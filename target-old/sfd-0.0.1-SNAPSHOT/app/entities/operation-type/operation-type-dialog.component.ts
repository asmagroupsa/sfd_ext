import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { OperationType } from './operation-type.model';
import { OperationTypePopupService } from './operation-type-popup.service';
import { OperationTypeService } from './operation-type.service';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';

@Component({
  selector: 'jhi-operation-type-dialog',
  templateUrl: './operation-type-dialog.component.html'
})
export class OperationTypeDialogComponent implements OnInit {
  operationType: OperationType;
  authorities: any[];
  isSaving: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private dataUtils: JhiDataUtils,
    private alertService: JhiAlertService,
    private operationTypeService: OperationTypeService,
    private eventManager: JhiEventManager
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, operationType, field, isImage) {
    if (event && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (isImage && !/^image\//.test(file.type)) {
        return;
      }
      this.dataUtils.toBase64(file, base64Data => {
        operationType[field] = base64Data;
        operationType[`${field}ContentType`] = file.type;
      });
    }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.operationType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.operationTypeService.update(this.operationType),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.operationTypeService.create(this.operationType),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<OperationType>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: OperationType) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: OperationType, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.operationType.created'
        : 'carmesfnmserviceApp.operationType.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'operationTypeListModification',
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
  selector: 'jhi-operation-type-popup',
  template: ''
})
export class OperationTypePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationTypePopupService: OperationTypePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.operationTypePopupService.open(
          OperationTypeDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.operationTypePopupService.open(
          OperationTypeDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
