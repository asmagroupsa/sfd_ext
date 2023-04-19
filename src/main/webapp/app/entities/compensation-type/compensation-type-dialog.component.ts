import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CompensationType } from './compensation-type.model';
import { CompensationTypePopupService } from './compensation-type-popup.service';
import { CompensationTypeService } from './compensation-type.service';

@Component({
  selector: 'jhi-compensation-type-dialog',
  templateUrl: './compensation-type-dialog.component.html',
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
export class CompensationTypeDialogComponent implements OnInit {
  compensationType: CompensationType;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private compensationTypeService: CompensationTypeService,
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
    if (this.compensationType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.compensationTypeService.update(this.compensationType),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.compensationTypeService.create(this.compensationType),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<CompensationType>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: CompensationType) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CompensationType, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.compensationType.created'
        : 'carmesfnmserviceApp.compensationType.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'compensationTypeListModification',
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
  selector: 'jhi-compensation-type-popup',
  template: ''
})
export class CompensationTypePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private compensationTypePopupService: CompensationTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.compensationTypePopupService.open(
          CompensationTypeDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.compensationTypePopupService.open(
          CompensationTypeDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
