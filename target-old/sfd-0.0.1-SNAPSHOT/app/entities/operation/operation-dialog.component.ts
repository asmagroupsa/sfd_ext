import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Operation } from './operation.model';
import { OperationPopupService } from './operation-popup.service';
import { OperationService } from './operation.service';
import { Compte, CompteService } from '../compte';
import { Credit, CreditService } from '../credit';
import { Compensation, CompensationService } from '../compensation';
import { OperationType, OperationTypeService } from '../operation-type';
import { Ecriture, EcritureService } from '../ecriture';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-operation-dialog',
  templateUrl: './operation-dialog.component.html'
})
export class OperationDialogComponent implements OnInit {
  operation: Operation;
  authorities: any[];
  isSaving: boolean;

  comptes: Compte[];

  credits: Credit[];

  compensations: Compensation[];

  operationtypes: OperationType[];

  ecritures: Ecriture[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private operationService: OperationService,
    private compteService: CompteService,
    private creditService: CreditService,
    private compensationService: CompensationService,
    private operationTypeService: OperationTypeService,
    private ecritureService: EcritureService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.compteService.query().subscribe(
      (res: ResponseWrapper) => {
        this.comptes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.creditService.query().subscribe(
      (res: ResponseWrapper) => {
        this.credits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.compensationService.query().subscribe(
      (res: ResponseWrapper) => {
        this.compensations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.operationTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.operationtypes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.ecritureService.query().subscribe(
      (res: ResponseWrapper) => {
        this.ecritures = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.operation.id !== undefined) {
      this.subscribeToSaveResponse(
        this.operationService.update(this.operation),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.operationService.create(this.operation),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Operation>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Operation) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Operation, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.operation.created' : 'carmesfnmserviceApp.operation.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'operationListModification',
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

  trackCompteById(index: number, item: Compte) {
    return item.id;
  }

  trackCreditById(index: number, item: Credit) {
    return item.id;
  }

  trackCompensationById(index: number, item: Compensation) {
    return item.id;
  }

  trackOperationTypeById(index: number, item: OperationType) {
    return item.id;
  }

  trackEcritureById(index: number, item: Ecriture) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-operation-popup',
  template: ''
})
export class OperationPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationPopupService: OperationPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.operationPopupService.open(
          OperationDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.operationPopupService.open(
          OperationDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
