import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeRembt } from './type-rembt.model';
import { TypeRembtPopupService } from './type-rembt-popup.service';
import { TypeRembtService } from './type-rembt.service';

@Component({
  selector: 'jhi-type-rembt-dialog',
  templateUrl: './type-rembt-dialog.component.html',
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
export class TypeRembtDialogComponent implements OnInit {
  typeRembt: TypeRembt;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private typeRembtService: TypeRembtService,
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
    if (this.typeRembt.id !== undefined) {
      this.subscribeToSaveResponse(
        this.typeRembtService.update(this.typeRembt),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.typeRembtService.create(this.typeRembt),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TypeRembt>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TypeRembt) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TypeRembt, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.typeRembt.created' : 'carmesfnmserviceApp.typeRembt.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'typeRembtListModification',
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
  selector: 'jhi-type-rembt-popup',
  template: ''
})
export class TypeRembtPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeRembtPopupService: TypeRembtPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.typeRembtPopupService.open(
          TypeRembtDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.typeRembtPopupService.open(
          TypeRembtDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
