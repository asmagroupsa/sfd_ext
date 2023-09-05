import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Literacy } from './literacy.model';
import { LiteracyPopupService } from './literacy-popup.service';
import { LiteracyService } from './literacy.service';

@Component({
  selector: 'jhi-literacy-dialog',
  templateUrl: './literacy-dialog.component.html',
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
export class LiteracyDialogComponent implements OnInit {
  literacy: Literacy;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private literacyService: LiteracyService,
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
    if (this.literacy.id !== undefined) {
      this.subscribeToSaveResponse(
        this.literacyService.update(this.literacy),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.literacyService.create(this.literacy),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Literacy>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Literacy) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Literacy, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.literacy.created' : 'carmesfnmserviceApp.literacy.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'literacyListModification',
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
  selector: 'jhi-literacy-popup',
  template: ''
})
export class LiteracyPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private literacyPopupService: LiteracyPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.literacyPopupService.open(
          LiteracyDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.literacyPopupService.open(LiteracyDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
