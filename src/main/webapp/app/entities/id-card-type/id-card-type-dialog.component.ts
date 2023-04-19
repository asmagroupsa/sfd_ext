import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IdCardType } from './id-card-type.model';
import { IdCardTypePopupService } from './id-card-type-popup.service';
import { IdCardTypeService } from './id-card-type.service';

@Component({
  selector: 'jhi-id-card-type-dialog',
  templateUrl: './id-card-type-dialog.component.html',
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
export class IdCardTypeDialogComponent implements OnInit {
  idCardType: IdCardType;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private idCardTypeService: IdCardTypeService,
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
    if (this.idCardType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.idCardTypeService.update(this.idCardType),
        false
      );
    } else {
      this.idCardType.code = 'xx';
      this.subscribeToSaveResponse(
        this.idCardTypeService.create(this.idCardType),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<IdCardType>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: IdCardType) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: IdCardType, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.idCardType.created' : 'carmesfnmserviceApp.idCardType.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'idCardTypeListModification',
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
  selector: 'jhi-id-card-type-popup',
  template: ''
})
export class IdCardTypePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private idCardTypePopupService: IdCardTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.idCardTypePopupService.open(
          IdCardTypeDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.idCardTypePopupService.open(
          IdCardTypeDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
