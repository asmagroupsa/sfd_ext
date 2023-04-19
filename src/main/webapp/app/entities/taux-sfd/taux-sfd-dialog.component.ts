import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TauxSFD } from './taux-sfd.model';
import { TauxSFDPopupService } from './taux-sfd-popup.service';
import { TauxSFDService } from './taux-sfd.service';
import { LigneCredit, LigneCreditService } from '../ligne-credit';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-taux-sfd-dialog',
  templateUrl: './taux-sfd-dialog.component.html'
})
export class TauxSFDDialogComponent implements OnInit {
  tauxSFD: TauxSFD;
  authorities: any[];
  isSaving: boolean;

  lignecredits: LigneCredit[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private tauxSFDService: TauxSFDService,
    private ligneCreditService: LigneCreditService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
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
    if (this.tauxSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.tauxSFDService.update(this.tauxSFD),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.tauxSFDService.create(this.tauxSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TauxSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TauxSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TauxSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.tauxSFD.created' : 'carmesfnmserviceApp.tauxSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'tauxSFDListModification',
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

  trackLigneCreditById(index: number, item: LigneCredit) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

@Component({
  selector: 'jhi-taux-sfd-popup',
  template: ''
})
export class TauxSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tauxSFDPopupService: TauxSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.tauxSFDPopupService.open(
          TauxSFDDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.tauxSFDPopupService.open(TauxSFDDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
