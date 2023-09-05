import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { AccountType } from './account-type.model';
import { AccountTypePopupService } from './account-type-popup.service';
import { AccountTypeService } from './account-type.service';
import { ResponseWrapper, LOCAL_FLAG, UserData } from '../../shared';
import { LanguesService } from '../../shared/myTranslation/langues';
declare let select_init: any;
@Component({
  selector: 'jhi-account-type-dialog',
  templateUrl: './account-type-dialog.component.html'
})
export class AccountTypeDialogComponent implements OnInit {
  accountType: AccountType;
  authorities: any[];
  isSaving: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private accountTypeService: AccountTypeService,
    private eventManager: JhiEventManager,
    public langue: LanguesService
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.accountType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.accountTypeService.update(this.accountType),
        false
      );
    } else {
      this.accountType.code = 'xxx';
      this.accountType.sfdReference = UserData.getInstance().getSFDReference();
      this.subscribeToSaveResponse(
        this.accountTypeService.create(this.accountType),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<AccountType>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: AccountType) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: AccountType, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.accountType.created' : 'carmesfnmserviceApp.accountType.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'accountTypeListModification',
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

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

@Component({
  selector: 'jhi-account-type-popup',
  template: ''
})
export class AccountTypePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private accountTypePopupService: AccountTypePopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.accountTypePopupService.open(
            AccountTypeDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.accountTypePopupService.open(
            AccountTypeDialogComponent as Component
          );
        }
      });
    // } else {
    //   window.history.back();
    // }
  }

  ngOnDestroy() {
    if (this.routeSub)
      this.routeSub.unsubscribe();
  }
}
