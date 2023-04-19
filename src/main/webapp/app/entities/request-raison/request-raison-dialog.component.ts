import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RequestRaison } from './request-raison.model';
import { RequestRaisonPopupService } from './request-raison-popup.service';
import { RequestRaisonService } from './request-raison.service';

@Component({
  selector: 'jhi-request-raison-dialog',
  templateUrl: './request-raison-dialog.component.html',
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
export class RequestRaisonDialogComponent implements OnInit {
  requestRaison: RequestRaison;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private requestRaisonService: RequestRaisonService,
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
    if (this.requestRaison.id !== undefined) {
      this.subscribeToSaveResponse(
        this.requestRaisonService.update(this.requestRaison),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.requestRaisonService.create(this.requestRaison),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<RequestRaison>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: RequestRaison) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: RequestRaison, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.requestRaison.created'
        : 'carmesfnmserviceApp.requestRaison.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'requestRaisonListModification',
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
  selector: 'jhi-request-raison-popup',
  template: ''
})
export class RequestRaisonPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private requestRaisonPopupService: RequestRaisonPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.requestRaisonPopupService.open(
          RequestRaisonDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.requestRaisonPopupService.open(
          RequestRaisonDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
