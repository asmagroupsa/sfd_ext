import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditRequestStatus } from './credit-request-status.model';
import { CreditRequestStatusService } from './credit-request-status.service';

@Injectable()
export class CreditRequestStatusPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private creditRequestStatusService: CreditRequestStatusService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.creditRequestStatusService
        .find(id)
        .subscribe(creditRequestStatus => {
          this.creditRequestStatusModalRef(component, creditRequestStatus);
        });
    } else {
      return this.creditRequestStatusModalRef(
        component,
        new CreditRequestStatus()
      );
    }
  }

  creditRequestStatusModalRef(
    component: Component,
    creditRequestStatus: CreditRequestStatus
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.creditRequestStatus = creditRequestStatus;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'credit-request-status', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'credit-request-status', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
