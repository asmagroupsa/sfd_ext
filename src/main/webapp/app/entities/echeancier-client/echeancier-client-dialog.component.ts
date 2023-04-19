import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EcheancierClient } from './echeancier-client.model';
import { EcheancierClientPopupService } from './echeancier-client-popup.service';
import { EcheancierClientService } from './echeancier-client.service';
import { Credit, CreditService } from '../credit';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-echeancier-client-dialog',
  templateUrl: './echeancier-client-dialog.component.html'
})
export class EcheancierClientDialogComponent implements OnInit {
  echeancierClient: EcheancierClient;
  authorities: any[];
  isSaving: boolean;

  credits: Credit[];
  startDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private echeancierClientService: EcheancierClientService,
    private creditService: CreditService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.creditService.query({ filter: 'echeancierclient-is-null' }).subscribe(
      (res: ResponseWrapper) => {
        if (!this.echeancierClient.creditId) {
          this.credits = res.json;
        } else {
          this.creditService.find(this.echeancierClient.creditId).subscribe(
            (subRes: Credit) => {
              this.credits = [subRes].concat(res.json);
            },
            (subRes: ResponseWrapper) => this.onError(subRes.json)
          );
        }
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.echeancierClient.id !== undefined) {
      this.subscribeToSaveResponse(
        this.echeancierClientService.update(this.echeancierClient),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.echeancierClientService.create(this.echeancierClient),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<EcheancierClient>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: EcheancierClient) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: EcheancierClient, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.echeancierClient.created'
        : 'carmesfnmserviceApp.echeancierClient.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'echeancierClientListModification',
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

  trackCreditById(index: number, item: Credit) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-echeancier-client-popup',
  template: ''
})
export class EcheancierClientPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancierClientPopupService: EcheancierClientPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.echeancierClientPopupService.open(
          EcheancierClientDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.echeancierClientPopupService.open(
          EcheancierClientDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
