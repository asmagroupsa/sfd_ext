import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Profession } from './profession.model';
import { ProfessionPopupService } from './profession-popup.service';
import { ProfessionService } from './profession.service';

@Component({
  selector: 'jhi-profession-dialog',
  templateUrl: './profession-dialog.component.html',
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
export class ProfessionDialogComponent implements OnInit {
  profession: Profession;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private professionService: ProfessionService,
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
    if (this.profession.id !== undefined) {
      this.subscribeToSaveResponse(
        this.professionService.update(this.profession),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.professionService.create(this.profession),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Profession>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Profession) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Profession, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.profession.created' : 'carmesfnmserviceApp.profession.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'professionListModification',
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
  selector: 'jhi-profession-popup',
  template: ''
})
export class ProfessionPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private professionPopupService: ProfessionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.professionPopupService.open(
          ProfessionDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.professionPopupService.open(
          ProfessionDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
