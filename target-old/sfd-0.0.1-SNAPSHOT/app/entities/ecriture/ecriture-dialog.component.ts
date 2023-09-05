import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Ecriture } from './ecriture.model';
import { EcriturePopupService } from './ecriture-popup.service';
import { EcritureService } from './ecriture.service';
import { OperationType, OperationTypeService } from '../operation-type';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;

@Component({
  selector: 'jhi-ecriture-dialog',
  templateUrl: './ecriture-dialog.component.html'
})
export class EcritureDialogComponent implements OnInit {
  ecriture: Ecriture;
  authorities: any[];
  isSaving: boolean;

  operationtypes: OperationType[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private ecritureService: EcritureService,
    private operationTypeService: OperationTypeService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.operationTypeService.query().subscribe(
      (res: ResponseWrapper) => {
        this.operationtypes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.ecriture.id !== undefined) {
      this.subscribeToSaveResponse(
        this.ecritureService.update(this.ecriture),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.ecritureService.create(this.ecriture),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Ecriture>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Ecriture) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Ecriture, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.ecriture.created' : 'carmesfnmserviceApp.ecriture.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'ecritureListModification',
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

  trackOperationTypeById(index: number, item: OperationType) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-ecriture-popup',
  template: ''
})
export class EcriturePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private ecriturePopupService: EcriturePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.ecriturePopupService.open(
          EcritureDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.ecriturePopupService.open(EcritureDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
