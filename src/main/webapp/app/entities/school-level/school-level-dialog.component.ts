import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SchoolLevel } from './school-level.model';
import { SchoolLevelPopupService } from './school-level-popup.service';
import { SchoolLevelService } from './school-level.service';

@Component({
  selector: 'jhi-school-level-dialog',
  templateUrl: './school-level-dialog.component.html',
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
export class SchoolLevelDialogComponent implements OnInit {
  schoolLevel: SchoolLevel;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private schoolLevelService: SchoolLevelService,
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
    if (this.schoolLevel.id !== undefined) {
      this.subscribeToSaveResponse(
        this.schoolLevelService.update(this.schoolLevel),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.schoolLevelService.create(this.schoolLevel),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<SchoolLevel>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: SchoolLevel) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: SchoolLevel, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.schoolLevel.created' : 'carmesfnmserviceApp.schoolLevel.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'schoolLevelListModification',
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
  selector: 'jhi-school-level-popup',
  template: ''
})
export class SchoolLevelPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private schoolLevelPopupService: SchoolLevelPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.schoolLevelPopupService.open(
          SchoolLevelDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.schoolLevelPopupService.open(
          SchoolLevelDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
