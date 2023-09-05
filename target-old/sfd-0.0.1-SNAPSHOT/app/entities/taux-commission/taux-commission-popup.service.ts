import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TauxCommission } from './taux-commission.model';
import { TauxCommissionService } from './taux-commission.service';

@Injectable()
export class TauxCommissionPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tauxCommissionService: TauxCommissionService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tauxCommissionService.find(id).subscribe(tauxCommission => {
        if (tauxCommission.createdDate) {
          tauxCommission.createdDate = {
            year: tauxCommission.createdDate.getFullYear(),
            month: tauxCommission.createdDate.getMonth() + 1,
            day: tauxCommission.createdDate.getDate()
          };
        }
        if (tauxCommission.lastModifiedDate) {
          tauxCommission.lastModifiedDate = {
            year: tauxCommission.lastModifiedDate.getFullYear(),
            month: tauxCommission.lastModifiedDate.getMonth() + 1,
            day: tauxCommission.lastModifiedDate.getDate()
          };
        }
        this.tauxCommissionModalRef(component, tauxCommission);
      });
    } else {
      return this.tauxCommissionModalRef(component, new TauxCommission());
    }
  }

  tauxCommissionModalRef(
    component: Component,
    tauxCommission: TauxCommission
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.tauxCommission = tauxCommission;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'taux-commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'taux-commission', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
