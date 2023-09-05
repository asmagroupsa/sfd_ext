import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ServiceUser } from './service-user.model';
import { ServiceUserPopupService } from './service-user-popup.service';
import { ServiceUserService } from './service-user.service';
import { UserData } from '../../shared';

@Component({
  selector: 'jhi-service-user-dialog',
  templateUrl: './service-user-dialog.component.html',
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
export class ServiceUserDialogComponent implements OnInit {
  serviceUser: ServiceUser;
  authorities: any[];
  isSaving: boolean;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private serviceUserService: ServiceUserService,
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
    if (this.serviceUser.id !== undefined) {
      this.subscribeToSaveResponse(
        this.serviceUserService.update(this.serviceUser),
        false
      );
    } else {
      this.serviceUser.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.serviceUserService.create(this.serviceUser),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<ServiceUser>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: ServiceUser) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: ServiceUser, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.serviceUser.created' : 'carmesfnmserviceApp.serviceUser.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'serviceUserListModification',
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
  selector: 'jhi-service-user-popup',
  template: ''
})
export class ServiceUserPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private serviceUserPopupService: ServiceUserPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.serviceUserPopupService.open(
          ServiceUserDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.serviceUserPopupService.open(
          ServiceUserDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
