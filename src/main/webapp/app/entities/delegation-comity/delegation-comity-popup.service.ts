import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DelegationComity } from './delegation-comity.model';
import { DelegationComityService } from './delegation-comity.service';

@Injectable()
export class DelegationComityPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private delegationComityService: DelegationComityService
  ) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.delegationComityService.find(id).subscribe(delegationComity => {
          this.ngbModalRef = this.delegationComityModalRef(
            component,
            delegationComity
          );
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.delegationComityModalRef(
            component,
            new DelegationComity()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  delegationComityModalRef(
    component: Component,
    delegationComity: DelegationComity
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.delegationComity = delegationComity;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'delegation-comity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'delegation-comity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
