import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OperationCompteTrancheTF } from './operation-compte-tranche-tf.model';
import { OperationCompteTrancheTFService } from './operation-compte-tranche-tf.service';

@Injectable()
export class OperationCompteTrancheTFPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private operationCompteTrancheTFService: OperationCompteTrancheTFService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.operationCompteTrancheTFService
        .find(id)
        .subscribe(operationCompteTrancheTF => {
          if (operationCompteTrancheTF.createdDate) {
            operationCompteTrancheTF.createdDate = {
              year: operationCompteTrancheTF.createdDate.getFullYear(),
              month: operationCompteTrancheTF.createdDate.getMonth() + 1,
              day: operationCompteTrancheTF.createdDate.getDate()
            };
          }
          if (operationCompteTrancheTF.lastModifiedDate) {
            operationCompteTrancheTF.lastModifiedDate = {
              year: operationCompteTrancheTF.lastModifiedDate.getFullYear(),
              month: operationCompteTrancheTF.lastModifiedDate.getMonth() + 1,
              day: operationCompteTrancheTF.lastModifiedDate.getDate()
            };
          }
          this.operationCompteTrancheTFModalRef(
            component,
            operationCompteTrancheTF
          );
        });
    } else {
      return this.operationCompteTrancheTFModalRef(
        component,
        new OperationCompteTrancheTF()
      );
    }
  }

  operationCompteTrancheTFModalRef(
    component: Component,
    operationCompteTrancheTF: OperationCompteTrancheTF
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.operationCompteTrancheTF = operationCompteTrancheTF;
    modalRef.result.then(
      result => {
        this.router.navigate(
          [
            '/entity',
            'operation-compte-tranche-tf',
            { outlets: { popup: null } }
          ],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          [
            '/entity',
            'operation-compte-tranche-tf',
            { outlets: { popup: null } }
          ],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
