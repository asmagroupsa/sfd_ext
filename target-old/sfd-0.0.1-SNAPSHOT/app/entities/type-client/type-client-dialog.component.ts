import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeClient } from './type-client.model';
import { TypeClientPopupService } from './type-client-popup.service';
import { TypeClientService } from './type-client.service';

@Component({
  selector: 'jhi-type-client-dialog',
  templateUrl: './type-client-dialog.component.html',
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
export class TypeClientDialogComponent implements OnInit {
  typeClient: TypeClient;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private typeClientService: TypeClientService,
    private eventManager: JhiEventManager
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.typeClient.id !== undefined) {
      this.subscribeToSaveResponse(
        this.typeClientService.update(this.typeClient),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.typeClientService.create(this.typeClient),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TypeClient>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TypeClient) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TypeClient, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.typeClient.created' : 'carmesfnmserviceApp.typeClient.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'typeClientListModification',
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
  selector: 'jhi-type-client-popup',
  template: ''
})
export class TypeClientPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeClientPopupService: TypeClientPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.typeClientPopupService.open(
          TypeClientDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.typeClientPopupService.open(
          TypeClientDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
