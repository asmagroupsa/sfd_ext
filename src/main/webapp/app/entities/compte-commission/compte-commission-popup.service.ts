import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompteCommission } from './compte-commission.model';
import { CompteCommissionService } from './compte-commission.service';

@Injectable()
export class CompteCommissionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private compteCommissionService: CompteCommissionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.compteCommissionService.find(id).subscribe(compteCommission => {
        if (compteCommission.createdDate) {
          compteCommission.createdDate = {
            year: compteCommission.createdDate.getFullYear(),
            month: compteCommission.createdDate.getMonth() + 1,
            day: compteCommission.createdDate.getDate()
          };
        }
        if (compteCommission.lastModifiedDate) {
          compteCommission.lastModifiedDate = {
            year: compteCommission.lastModifiedDate.getFullYear(),
            month: compteCommission.lastModifiedDate.getMonth() + 1,
            day: compteCommission.lastModifiedDate.getDate()
          };
        }
        this.compteCommissionModalRef(component, compteCommission);
      });
    } else {
      return this.compteCommissionModalRef(component, new CompteCommission());
    }
  }

  compteCommissionModalRef(
    component: Component,
    compteCommission: CompteCommission
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.compteCommission = compteCommission;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'compte-commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'compte-commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
