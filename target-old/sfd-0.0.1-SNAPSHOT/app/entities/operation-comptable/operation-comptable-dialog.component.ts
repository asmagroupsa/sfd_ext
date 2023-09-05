import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationComptable } from './operation-comptable.model';
import { OperationComptablePopupService } from './operation-comptable-popup.service';
import { OperationComptableService } from './operation-comptable.service';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-operation-comptable-dialog',
  templateUrl: './operation-comptable-dialog.component.html'
})
export class OperationComptableDialogComponent implements OnInit {
  operationComptable: OperationComptable;
  isSaving: boolean;
  dateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private operationComptableService: OperationComptableService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.operationComptable.id !== undefined) {
      this.subscribeToSaveResponse(
        this.operationComptableService.update(this.operationComptable)
      );
    } else {
      this.subscribeToSaveResponse(
        this.operationComptableService.create(this.operationComptable)
      );
    }
  }

  private subscribeToSaveResponse(result: Observable<OperationComptable>) {
    result.subscribe(
      (res: OperationComptable) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError()
    );
  }

  private onSaveSuccess(result: OperationComptable) {
    this.eventManager.broadcast({
      name: 'operationComptableListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.alertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-operation-comptable-popup',
  template: ''
})
export class OperationComptablePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationComptablePopupService: OperationComptablePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.operationComptablePopupService.open(
          OperationComptableDialogComponent as Component,
          params['id']
        );
      } else {
        this.operationComptablePopupService.open(
          OperationComptableDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
