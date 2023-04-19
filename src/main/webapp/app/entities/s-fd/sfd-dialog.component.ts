import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SFD } from './sfd.model';
import { SFDPopupService } from './sfd-popup.service';
import { SFDService } from './sfd.service';
import { Client, ClientService } from '../client';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;

@Component({
  selector: 'jhi-sfd-dialog',
  templateUrl: './sfd-dialog.component.html'
})
export class SFDDialogComponent implements OnInit {
  sFD: SFD;
  authorities: any[];
  isSaving: boolean;

  clients: Client[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private sFDService: SFDService,
    private clientService: ClientService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.clientService.query().subscribe(
      (res: ResponseWrapper) => {
        this.clients = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }
  ngAfterViewInit() {
    select_init();
  }
  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.sFD.id !== undefined) {
      this.subscribeToSaveResponse(this.sFDService.update(this.sFD), false);
    } else {
      this.subscribeToSaveResponse(this.sFDService.create(this.sFD), true);
    }
  }

  private subscribeToSaveResponse(result: Observable<SFD>, isCreated: boolean) {
    result.subscribe(
      (res: SFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: SFD, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.sFD.created' : 'carmesfnmserviceApp.sFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({ name: 'sFDListModification', content: 'OK' });
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

  trackClientById(index: number, item: Client) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-sfd-popup',
  template: ''
})
export class SFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private sFDPopupService: SFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.sFDPopupService.open(
          SFDDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.sFDPopupService.open(SFDDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
