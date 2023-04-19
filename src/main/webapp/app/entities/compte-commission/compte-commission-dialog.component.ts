import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CompteCommission } from './compte-commission.model';
import { CompteCommissionPopupService } from './compte-commission-popup.service';
import { CompteCommissionService } from './compte-commission.service';
import { Budget, BudgetService } from '../budget';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-compte-commission-dialog',
  templateUrl: './compte-commission-dialog.component.html'
})
export class CompteCommissionDialogComponent implements OnInit {
  compteCommission: CompteCommission;
  authorities: any[];
  isSaving: boolean;

  budgets: Budget[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private compteCommissionService: CompteCommissionService,
    private budgetService: BudgetService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.budgetService.query().subscribe(
      (res: ResponseWrapper) => {
        this.budgets = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.compteCommission.id !== undefined) {
      this.subscribeToSaveResponse(
        this.compteCommissionService.update(this.compteCommission),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.compteCommissionService.create(this.compteCommission),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<CompteCommission>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: CompteCommission) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: CompteCommission, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.compteCommission.created'
        : 'carmesfnmserviceApp.compteCommission.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'compteCommissionListModification',
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

  trackBudgetById(index: number, item: Budget) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-compte-commission-popup',
  template: ''
})
export class CompteCommissionPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private compteCommissionPopupService: CompteCommissionPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.compteCommissionPopupService.open(
          CompteCommissionDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.compteCommissionPopupService.open(
          CompteCommissionDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
