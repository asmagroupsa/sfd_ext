import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SituationMat } from './situation-mat.model';
import { SituationMatPopupService } from './situation-mat-popup.service';
import { SituationMatService } from './situation-mat.service';

@Component({
  selector: 'jhi-situation-mat-dialog',
  templateUrl: './situation-mat-dialog.component.html',
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
export class SituationMatDialogComponent implements OnInit {
  situationMat: SituationMat;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private situationMatService: SituationMatService,
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
    if (this.situationMat.id !== undefined) {
      this.subscribeToSaveResponse(
        this.situationMatService.update(this.situationMat),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.situationMatService.create(this.situationMat),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<SituationMat>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: SituationMat) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: SituationMat, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.situationMat.created' : 'carmesfnmserviceApp.situationMat.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'situationMatListModification',
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
  selector: 'jhi-situation-mat-popup',
  template: ''
})
export class SituationMatPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private situationMatPopupService: SituationMatPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.situationMatPopupService.open(
          SituationMatDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.situationMatPopupService.open(
          SituationMatDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
