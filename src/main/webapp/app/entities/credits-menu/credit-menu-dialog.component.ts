import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CreditMenu } from './credit-menu.model';
import { CreditMenuPopupService } from './credit-menu-popup.service';
import { CreditMenuService } from './credit-menu.service';

@Component({
  selector: 'jhi-credit-menu-dialog',
  templateUrl: './credit-menu-dialog.component.html',
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
export class CreditMenuDialogComponent implements OnInit {
  unity: CreditMenu;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private unityService: CreditMenuService,
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
    if (this.unity.id !== undefined) {
      this.subscribeToSaveResponse(this.unityService.update(this.unity), false);
    } else {
      this.subscribeToSaveResponse(this.unityService.create(this.unity), true);
    }
  }

  private subscribeToSaveResponse(
    result: Observable<CreditMenu>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: CreditMenu) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CreditMenu, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.unity.created' : 'carmesfnmserviceApp.unity.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'unityListModification',
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
  selector: 'jhi-credit-menu-popup',
  template: ''
})
export class CreditMenuPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private unityPopupService: CreditMenuPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.unityPopupService.open(
          CreditMenuDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.unityPopupService.open(CreditMenuDialogComponent);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
