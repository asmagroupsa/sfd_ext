import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Budget } from './budget.model';
import { BudgetPopupService } from './budget-popup.service';
import { BudgetService } from './budget.service';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-budget-dialog',
  templateUrl: './budget-dialog.component.html'
})
export class BudgetDialogComponent implements OnInit {
  budget: Budget;
  authorities: any[];
  isSaving: boolean;
  activeDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private budgetService: BudgetService,
    private eventManager: JhiEventManager
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
    if (this.budget.id !== undefined) {
      this.subscribeToSaveResponse(
        this.budgetService.update(this.budget),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.budgetService.create(this.budget),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Budget>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Budget) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Budget, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.budget.created' : 'carmesfnmserviceApp.budget.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'budgetListModification',
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
  selector: 'jhi-budget-popup',
  template: ''
})
export class BudgetPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private budgetPopupService: BudgetPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.budgetPopupService.open(
          BudgetDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.budgetPopupService.open(BudgetDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
