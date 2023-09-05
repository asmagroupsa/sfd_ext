import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SettingSFD } from './setting-sfd.model';
import { SettingSFDPopupService } from './setting-sfd-popup.service';
import { SettingSFDService } from './setting-sfd.service';
import { SFD, SFDService } from '../s-fd';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-setting-sfd-dialog',
  templateUrl: './setting-sfd-dialog.component.html'
})
export class SettingSFDDialogComponent implements OnInit {
  settingSFD: SettingSFD;
  authorities: any[];
  isSaving: boolean;

  sfds: SFD[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private settingSFDService: SettingSFDService,
    private sFDService: SFDService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.sFDService.query().subscribe(
      (res: ResponseWrapper) => {
        this.sfds = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.settingSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.settingSFDService.update(this.settingSFD),
        false
      );
    } else {
      this.settingSFD.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.settingSFDService.create(this.settingSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<SettingSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: SettingSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: SettingSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.settingSFD.created' : 'carmesfnmserviceApp.settingSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'settingSFDListModification',
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

  trackSFDById(index: number, item: SFD) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-setting-sfd-popup',
  template: ''
})
export class SettingSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private settingSFDPopupService: SettingSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.settingSFDPopupService.open(
          SettingSFDDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.settingSFDPopupService.open(
          SettingSFDDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
