import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Nationality } from './nationality.model';
import { NationalityPopupService } from './nationality-popup.service';
import { NationalityService } from './nationality.service';

@Component({
  selector: 'jhi-nationality-dialog',
  templateUrl: './nationality-dialog.component.html',
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
export class NationalityDialogComponent implements OnInit {
  nationality: Nationality;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private nationalityService: NationalityService,
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
    if (this.nationality.id !== undefined) {
      this.subscribeToSaveResponse(
        this.nationalityService.update(this.nationality),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.nationalityService.create(this.nationality),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Nationality>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Nationality) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Nationality, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.nationality.created' : 'carmesfnmserviceApp.nationality.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'nationalityListModification',
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
  selector: 'jhi-nationality-popup',
  template: ''
})
export class NationalityPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private nationalityPopupService: NationalityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.nationalityPopupService.open(
          NationalityDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.nationalityPopupService.open(
          NationalityDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
