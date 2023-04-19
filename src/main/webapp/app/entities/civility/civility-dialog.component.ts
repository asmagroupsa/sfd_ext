import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Civility } from './civility.model';
import { CivilityPopupService } from './civility-popup.service';
import { CivilityService } from './civility.service';

@Component({
  selector: 'jhi-civility-dialog',
  templateUrl: './civility-dialog.component.html',
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
export class CivilityDialogComponent implements OnInit {
  civility: Civility;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private civilityService: CivilityService,
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
    if (this.civility.id !== undefined) {
      this.subscribeToSaveResponse(
        this.civilityService.update(this.civility),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.civilityService.create(this.civility),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Civility>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Civility) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Civility, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.civility.created' : 'carmesfnmserviceApp.civility.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'civilityListModification',
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
  selector: 'jhi-civility-popup',
  template: ''
})
export class CivilityPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private civilityPopupService: CivilityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.civilityPopupService.open(
          CivilityDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.civilityPopupService.open(CivilityDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
