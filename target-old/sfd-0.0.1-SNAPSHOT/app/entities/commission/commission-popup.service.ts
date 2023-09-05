import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Commission } from './commission.model';
import { CommissionService } from './commission.service';

@Injectable()
export class CommissionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private commissionService: CommissionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.commissionService.find(id).subscribe(commission => {
        if (commission.createdDate) {
          commission.createdDate = {
            year: commission.createdDate.getFullYear(),
            month: commission.createdDate.getMonth() + 1,
            day: commission.createdDate.getDate()
          };
        }
        if (commission.lastModifiedDate) {
          commission.lastModifiedDate = {
            year: commission.lastModifiedDate.getFullYear(),
            month: commission.lastModifiedDate.getMonth() + 1,
            day: commission.lastModifiedDate.getDate()
          };
        }
        this.commissionModalRef(component, commission);
      });
    } else {
      return this.commissionModalRef(component, new Commission());
    }
  }

  commissionModalRef(
    component: Component,
    commission: Commission
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.commission = commission;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
