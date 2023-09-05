import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { NotificationSFD } from './notification-sfd.model';
import { NotificationSFDPopupService } from './notification-sfd-popup.service';
import { NotificationSFDService } from './notification-sfd.service';
import { LigneRequest, LigneRequestService } from '../ligne-request';
import { LigneCredit, LigneCreditService } from '../ligne-credit';
import { ResponseWrapper, UserData } from '../../shared';
import { numberToLocalString } from '../../shared/model/functions';
declare let select_init: any;
@Component({
  selector: 'jhi-notification-sfd-dialog',
  templateUrl: './notification-sfd-dialog.component.html'
})
export class NotificationSFDDialogComponent implements OnInit {
  notificationSFD: NotificationSFD;
  authorities: any[];
  isSaving: boolean;

  lignerequests: LigneRequest[];

  lignecredits: LigneCredit[];
  notificationDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;
  notificationSFDAmount: string;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private notificationSFDService: NotificationSFDService,
    private ligneRequestService: LigneRequestService,
    private ligneCreditService: LigneCreditService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    if (this.notificationSFD.id) this.notificationSFDAmount = numberToLocalString(this.notificationSFD.amount.toString());
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.ligneRequestService
      .query({ filter: 'notificationsfd-is-null' })
      .subscribe(
        (res: ResponseWrapper) => {
          if (!this.notificationSFD.ligneRequestId) {
            this.lignerequests = res.json;
          } else {
            this.ligneRequestService
              .find(this.notificationSFD.ligneRequestId)
              .subscribe(
                (subRes: LigneRequest) => {
                  this.lignerequests = [subRes].concat(res.json);
                },
                (subRes: ResponseWrapper) => this.onError(subRes.json)
              );
          }
        },
        (res: ResponseWrapper) => this.onError(res.json)
      );
    this.ligneCreditService.query().subscribe(
      (res: ResponseWrapper) => {
        this.lignecredits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.notificationSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.notificationSFDService.update(this.notificationSFD),
        false
      );
    } else {
      this.notificationSFD.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.notificationSFDService.create(this.notificationSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<NotificationSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: NotificationSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: NotificationSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.notificationSFD.created'
        : 'carmesfnmserviceApp.notificationSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'notificationSFDListModification',
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

  trackLigneRequestById(index: number, item: LigneRequest) {
    return item.id;
  }

  trackLigneCreditById(index: number, item: LigneCredit) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-notification-sfd-popup',
  template: ''
})
export class NotificationSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private notificationSFDPopupService: NotificationSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.notificationSFDPopupService.open(
          NotificationSFDDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.notificationSFDPopupService.open(
          NotificationSFDDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
