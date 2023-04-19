import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Budget } from './budget.model';
import { BudgetPopupService } from './budget-popup.service';
import { BudgetService } from './budget.service';

@Component({
  selector: 'jhi-budget-delete-dialog',
  templateUrl: './budget-delete-dialog.component.html'
})
export class BudgetDeleteDialogComponent {
  budget: Budget;

  constructor(
    private budgetService: BudgetService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) { }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.budgetService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'budgetListModification',
        content: 'Deleted an budget'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.budget.deleted', { param: id }, null)
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.budget.deleted', { param: id }, null)
    });
  }
}

@Component({
  selector: 'jhi-budget-delete-popup',
  template: ''
})
export class BudgetDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private budgetPopupService: BudgetPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.budgetPopupService.open(
        BudgetDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
