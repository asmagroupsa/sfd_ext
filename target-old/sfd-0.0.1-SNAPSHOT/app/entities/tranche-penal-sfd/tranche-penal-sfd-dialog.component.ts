import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TranchePenalSFD } from './tranche-penal-sfd.model';
import { TranchePenalSFDPopupService } from './tranche-penal-sfd-popup.service';
import { TranchePenalSFDService } from './tranche-penal-sfd.service';
import { LanguesService } from '../../shared/myTranslation/langues';

@Component({
  selector: 'jhi-tranche-penal-sfd-dialog',
  templateUrl: './tranche-penal-sfd-dialog.component.html',
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
export class TranchePenalSFDDialogComponent implements OnInit {
  tranchePenalSFD: TranchePenalSFD;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private tranchePenalSFDService: TranchePenalSFDService,
    private eventManager: JhiEventManager,
    public langue: LanguesService
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
    if (this.tranchePenalSFD.id !== undefined) {
      this.subscribeToSaveResponse(
        this.tranchePenalSFDService.update(this.tranchePenalSFD),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.tranchePenalSFDService.create(this.tranchePenalSFD),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TranchePenalSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TranchePenalSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TranchePenalSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.tranchePenalSFD.created'
        : 'carmesfnmserviceApp.tranchePenalSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'tranchePenalSFDListModification',
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
  selector: 'jhi-tranche-penal-sfd-popup',
  template: ''
})
export class TranchePenalSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tranchePenalSFDPopupService: TranchePenalSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.tranchePenalSFDPopupService.open(
          TranchePenalSFDDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.tranchePenalSFDPopupService.open(
          TranchePenalSFDDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
