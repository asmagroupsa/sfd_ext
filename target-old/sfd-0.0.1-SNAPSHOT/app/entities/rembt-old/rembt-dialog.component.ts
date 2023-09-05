import { Component, OnDestroy, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { ResponseWrapper } from '../../shared';
import { EcheancesClient } from '../echeancier-client/echeances-client/echeances-client.model';
import { EcheancesClientService } from '../echeancier-client/echeances-client/echeances-client.service';
import { TypeRembt, TypeRembtService } from '../type-rembt';
import { RembtPopupService } from './rembt-popup.service';
import { Rembt } from './rembt.model';
import { RembtService } from './rembt.service';

declare let select_init: any;
@Component({
  selector: 'jhi-rembt-dialog',
  templateUrl: './rembt-dialog.component.html'
})
export class RembtDialogComponent implements OnInit {
  rembt: Rembt;
  authorities: any[];
  isSaving: boolean;

  echeancesclients: EcheancesClient[];

  typerembts: TypeRembt[];
  rembDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private rembtService: RembtService,
    private echeancesClientService: EcheancesClientService,
    private typeRembtService: TypeRembtService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.echeancesClientService.query().subscribe(
      (res: ResponseWrapper) => {
        this.echeancesclients = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.typeRembtService.query().subscribe(
      (res: ResponseWrapper) => {
        this.typerembts = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.rembt.id !== undefined) {
      this.subscribeToSaveResponse(this.rembtService.update(this.rembt), false);
    } else {
      this.subscribeToSaveResponse(this.rembtService.create(this.rembt), true);
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Rembt>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Rembt) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Rembt, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.rembt.created' : 'carmesfnmserviceApp.rembt.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'rembtListModification',
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

  trackEcheancesClientById(index: number, item: EcheancesClient) {
    return item.id;
  }

  trackTypeRembtById(index: number, item: TypeRembt) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-rembt-popup',
  template: ''
})
export class RembtPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private rembtPopupService: RembtPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.rembtPopupService.open(
          RembtDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.rembtPopupService.open(RembtDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
