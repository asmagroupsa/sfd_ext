import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TypeMembre } from './type-membre.model';
import { TypeMembrePopupService } from './type-membre-popup.service';
import { TypeMembreService } from './type-membre.service';

@Component({
  selector: 'jhi-type-membre-dialog',
  templateUrl: './type-membre-dialog.component.html',
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
export class TypeMembreDialogComponent implements OnInit {
  typeMembre: TypeMembre;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private typeMembreService: TypeMembreService,
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
    if (this.typeMembre.id !== undefined) {
      this.subscribeToSaveResponse(
        this.typeMembreService.update(this.typeMembre),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.typeMembreService.create(this.typeMembre),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TypeMembre>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TypeMembre) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TypeMembre, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.typeMembre.created' : 'carmesfnmserviceApp.typeMembre.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'typeMembreListModification',
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
  selector: 'jhi-type-membre-popup',
  template: ''
})
export class TypeMembrePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeMembrePopupService: TypeMembrePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.typeMembrePopupService.open(
          TypeMembreDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.typeMembrePopupService.open(
          TypeMembreDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
