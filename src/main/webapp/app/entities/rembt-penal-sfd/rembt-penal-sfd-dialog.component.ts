import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RembtPenalSFD } from './rembt-penal-sfd.model';
import { RembtPenalSFDPopupService } from './rembt-penal-sfd-popup.service';
import { RembtPenalSFDService } from './rembt-penal-sfd.service';
import { ResponseWrapper, UserData } from '../../shared';
import { EcheancesSFD } from '../echeancier-sfd/echeances-sfd/echeances-sfd.model';
import { EcheancesSFDService } from '../echeancier-sfd/echeances-sfd/echeances-sfd.service';
declare let select_init: any;
@Component({
  selector: 'jhi-rembt-penal-sfd-dialog',
  templateUrl: './rembt-penal-sfd-dialog.component.html'
})
export class RembtPenalSFDDialogComponent implements OnInit {
  rembtPenalSFD: RembtPenalSFD;
  authorities: any[];
  isSaving: boolean;

  echeancessfds: EcheancesSFD[];
  rembPenalDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private rembtPenalSFDService: RembtPenalSFDService,
    private echeancesSFDService: EcheancesSFDService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.echeancesSFDService
      .query({ filter: 'rembtpenalsfd-is-null' })
      .subscribe(
        (res: ResponseWrapper) => {
          if (!this.rembtPenalSFD.echeancesSFDId) {
            this.echeancessfds = res.json;
          } else {
            this.echeancesSFDService
              .find(this.rembtPenalSFD.echeancesSFDId)
              .subscribe(
                (subRes: EcheancesSFD) => {
                  this.echeancessfds = [subRes].concat(res.json);
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
    if (this.rembtPenalSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.rembtPenalSFDService.update(this.rembtPenalSFD),
        false
      );
    } else {
      this.rembtPenalSFD.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.rembtPenalSFDService.create(this.rembtPenalSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<RembtPenalSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: RembtPenalSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: RembtPenalSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.rembtPenalSFD.created'
        : 'carmesfnmserviceApp.rembtPenalSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'rembtPenalSFDListModification',
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

  trackEcheancesSFDById(index: number, item: EcheancesSFD) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-rembt-penal-sfd-popup',
  template: ''
})
export class RembtPenalSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private rembtPenalSFDPopupService: RembtPenalSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.rembtPenalSFDPopupService.open(
          RembtPenalSFDDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.rembtPenalSFDPopupService.open(
          RembtPenalSFDDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
