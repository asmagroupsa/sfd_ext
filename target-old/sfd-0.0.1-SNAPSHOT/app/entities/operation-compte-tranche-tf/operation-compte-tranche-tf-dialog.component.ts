import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OperationCompteTrancheTF } from './operation-compte-tranche-tf.model';
import { OperationCompteTrancheTFPopupService } from './operation-compte-tranche-tf-popup.service';
import { OperationCompteTrancheTFService } from './operation-compte-tranche-tf.service';
import { AccountType, AccountTypeService } from '../account-type';
import { OperationType, OperationTypeService } from '../operation-type';
import {
  TrancheTauxFrais,
  TrancheTauxFraisService
} from '../tranche-taux-frais';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-operation-compte-tranche-tf-dialog',
  templateUrl: './operation-compte-tranche-tf-dialog.component.html'
})
export class OperationCompteTrancheTFDialogComponent implements OnInit {
  operationCompteTrancheTF: OperationCompteTrancheTF;
  authorities: any[];
  isSaving: boolean;

  accounttypes: AccountType[];

  operationtypes: OperationType[];

  tranchetauxfrais: TrancheTauxFrais[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private operationCompteTrancheTFService: OperationCompteTrancheTFService,
    private accountTypeService: AccountTypeService,
    private operationTypeService: OperationTypeService,
    private trancheTauxFraisService: TrancheTauxFraisService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.accountTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.accounttypes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.operationTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.operationtypes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.trancheTauxFraisService.query().subscribe(
      (res: ResponseWrapper) => {
        this.tranchetauxfrais = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.operationCompteTrancheTF.id !== undefined) {
      this.subscribeToSaveResponse(
        this.operationCompteTrancheTFService.update(
          this.operationCompteTrancheTF
        ),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.operationCompteTrancheTFService.create(
          this.operationCompteTrancheTF
        ),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<OperationCompteTrancheTF>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: OperationCompteTrancheTF) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: OperationCompteTrancheTF, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.operationCompteTrancheTF.created'
        : 'carmesfnmserviceApp.operationCompteTrancheTF.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'operationCompteTrancheTFListModification',
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

  trackAccountTypeById(index: number, item: AccountType) {
    return item.id;
  }

  trackOperationTypeById(index: number, item: OperationType) {
    return item.id;
  }

  trackTrancheTauxFraisById(index: number, item: TrancheTauxFrais) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-operation-compte-tranche-tf-popup',
  template: ''
})
export class OperationCompteTrancheTFPopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationCompteTrancheTFPopupService: OperationCompteTrancheTFPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.operationCompteTrancheTFPopupService.open(
          OperationCompteTrancheTFDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.operationCompteTrancheTFPopupService.open(
          OperationCompteTrancheTFDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
