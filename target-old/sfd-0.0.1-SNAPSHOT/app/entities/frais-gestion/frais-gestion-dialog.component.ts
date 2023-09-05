import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FraisGestion } from './frais-gestion.model';
import { FraisGestionPopupService } from './frais-gestion-popup.service';
import { FraisGestionService } from './frais-gestion.service';

@Component({
  selector: 'jhi-frais-gestion-dialog',
  templateUrl: './frais-gestion-dialog.component.html',
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
export class FraisGestionDialogComponent implements OnInit {
  fraisGestion: FraisGestion;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private fraisGestionService: FraisGestionService,
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
    if (this.fraisGestion.id !== undefined) {
      this.subscribeToSaveResponse(
        this.fraisGestionService.update(this.fraisGestion),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.fraisGestionService.create(this.fraisGestion),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<FraisGestion>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: FraisGestion) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: FraisGestion, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.fraisGestion.created' : 'carmesfnmserviceApp.fraisGestion.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'fraisGestionListModification',
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
  selector: 'jhi-frais-gestion-popup',
  template: ''
})
export class FraisGestionPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisGestionPopupService: FraisGestionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.fraisGestionPopupService.open(
          FraisGestionDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.fraisGestionPopupService.open(
          FraisGestionDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
