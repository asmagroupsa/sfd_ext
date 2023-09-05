import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy, formatNumberToLocalString } from '../../shared/model/functions';
import { NotificationClient } from './notification-client.model';
import { NotificationClientPopupService } from './notification-client-popup.service';
import { NotificationClientService } from './notification-client.service';
import { CreditRequest, CreditRequestService } from '../credit-request';
import { Credit, CreditService } from '../credit';
import { ResponseWrapper, Principal, UserData } from '../../shared';
import { Formation, FormationService } from '../formation';
declare let select_init: any;
@Component({
  selector: 'jhi-notification-client-dialog',
  templateUrl: './notification-client-dialog.component.html'
})
export class NotificationClientDialogComponent implements OnInit {
  notificationClient: NotificationClient;
  authorities: any[];
  isSaving: boolean;
  formations: Formation[];
  creditrequests: CreditRequest[];

  credits: Credit[];
  notificationDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;
  notificationClientAmount: string;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private notificationClientService: NotificationClientService,
    private formationService: FormationService,
    private creditRequestService: CreditRequestService,
    private creditService: CreditService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    if (this.notificationClient.id) this.notificationClientAmount = formatNumberToLocalString(this.notificationClient.amount);

    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.creditRequestService
      .query({ filter: 'notificationclient-is-null' })
      .subscribe(
        (res: ResponseWrapper) => {
          if (!this.notificationClient.creditRequestId) {
            this.creditrequests = res.json;
          } else {
            this.creditRequestService
              .find(this.notificationClient.creditRequestId)
              .subscribe(
                (subRes: CreditRequest) => {
                  this.creditrequests = [subRes].concat(res.json);
                },
                (subRes: ResponseWrapper) => this.onError(subRes.json)
              );
          }
        },
        (res: ResponseWrapper) => this.onError(res.json)
      );
    this.creditService.query().subscribe(
      (res: ResponseWrapper) => {
        this.credits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.formationService.query().subscribe(
      (res: ResponseWrapper) => {
        this.formations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.principal.identity().then(
      (identity: any) => {
        if (this.notificationClient.id !== undefined) {
          setLastModifyBy(this.notificationClient, identity);
          ' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.notificationClientService.update(this.notificationClient),
            false
          );
        } else {
          setCreateBy(this.notificationClient, identity);
          this.notificationClient.status = false;
          this.subscribeToSaveResponse(
            this.notificationClientService.create(this.notificationClient),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<NotificationClient>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: NotificationClient) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: NotificationClient, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.notificationClient.created'
        : 'carmesfnmserviceApp.notificationClient.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'notificationClientListModification',
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

  trackCreditRequestById(index: number, item: CreditRequest) {
    return item.id;
  }

  trackCreditById(index: number, item: Credit) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-notification-client-popup',
  template: ''
})
export class NotificationClientPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private notificationClientPopupService: NotificationClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.notificationClientPopupService.open(
          NotificationClientDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.notificationClientPopupService.open(
          NotificationClientDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
