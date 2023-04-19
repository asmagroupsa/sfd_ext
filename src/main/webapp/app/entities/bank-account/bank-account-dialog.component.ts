import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BankAccount } from './bank-account.model';
import { BankAccountPopupService } from './bank-account-popup.service';
import { BankAccountService } from './bank-account.service';
import { Bank, BankService } from '../bank';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html'
})
export class BankAccountDialogComponent implements OnInit {
  bankAccount: BankAccount;
  isSaving: boolean;

  banks: Bank[];
  dateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private bankAccountService: BankAccountService,
    private bankService: BankService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.bankService
      .query({
        size: 1000,
        'sfdReference.equals': UserData.getInstance().currentSfdReference
      })
      .subscribe(
        (res: ResponseWrapper) => {
          this.banks = res.json;
        },
        (res: ResponseWrapper) => this.onError(res.json)
      );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.bankAccount.id !== undefined) {
      this.subscribeToSaveResponse(
        this.bankAccountService.update(this.bankAccount)
      );
    } else {
      this.bankAccount.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.bankAccountService.create(this.bankAccount)
      );
    }
  }

  private subscribeToSaveResponse(result: Observable<BankAccount>) {
    result.subscribe(
      (res: BankAccount) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError()
    );
  }

  private onSaveSuccess(result: BankAccount) {
    this.eventManager.broadcast({
      name: 'bankAccountListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.alertService.error(error.message, null, null);
  }

  trackBankById(index: number, item: Bank) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-bank-account-popup',
  template: ''
})
export class BankAccountPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private bankAccountPopupService: BankAccountPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.bankAccountPopupService.open(
          BankAccountDialogComponent as Component,
          params['id']
        );
      } else {
        this.bankAccountPopupService.open(
          BankAccountDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
