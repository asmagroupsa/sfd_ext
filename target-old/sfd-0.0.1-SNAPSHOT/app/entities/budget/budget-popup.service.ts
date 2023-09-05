import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from './budget.model';
import { BudgetService } from './budget.service';

@Injectable()
export class BudgetPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private budgetService: BudgetService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.budgetService.find(id).subscribe(budget => {
        if (budget.activeDate) {
          budget.activeDate = {
            year: budget.activeDate.getFullYear(),
            month: budget.activeDate.getMonth() + 1,
            day: budget.activeDate.getDate()
          };
        }
        if (budget.createdDate) {
          budget.createdDate = {
            year: budget.createdDate.getFullYear(),
            month: budget.createdDate.getMonth() + 1,
            day: budget.createdDate.getDate()
          };
        }
        if (budget.lastModifiedDate) {
          budget.lastModifiedDate = {
            year: budget.lastModifiedDate.getFullYear(),
            month: budget.lastModifiedDate.getMonth() + 1,
            day: budget.lastModifiedDate.getDate()
          };
        }
        this.budgetModalRef(component, budget);
      });
    } else {
      return this.budgetModalRef(component, new Budget());
    }
  }

  budgetModalRef(component: Component, budget: Budget): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.budget = budget;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'budget', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'budget', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
