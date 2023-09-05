import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OperationComptable } from './operation-comptable.model';
import { OperationComptableService } from './operation-comptable.service';

@Injectable()
export class OperationComptablePopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private operationComptableService: OperationComptableService
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
        this.operationComptableService
          .find(id)
          .subscribe(operationComptable => {
            if (operationComptable.date) {
              operationComptable.date = {
                year: operationComptable.date.getFullYear(),
                month: operationComptable.date.getMonth() + 1,
                day: operationComptable.date.getDate()
              };
            }
            this.ngbModalRef = this.operationComptableModalRef(
              component,
              operationComptable
            );
            resolve(this.ngbModalRef);
          });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.operationComptableModalRef(
            component,
            new OperationComptable()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  operationComptableModalRef(
    component: Component,
    operationComptable: OperationComptable
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.operationComptable = operationComptable;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'operation-comptable', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'operation-comptable', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
