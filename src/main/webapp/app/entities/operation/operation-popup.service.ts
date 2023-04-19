import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Operation } from './operation.model';
import { OperationService } from './operation.service';

@Injectable()
export class OperationPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private operationService: OperationService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.operationService.find(id).subscribe(operation => {
        if (operation.createdDate) {
          operation.createdDate = {
            year: operation.createdDate.getFullYear(),
            month: operation.createdDate.getMonth() + 1,
            day: operation.createdDate.getDate()
          };
        }
        if (operation.lastModifiedDate) {
          operation.lastModifiedDate = {
            year: operation.lastModifiedDate.getFullYear(),
            month: operation.lastModifiedDate.getMonth() + 1,
            day: operation.lastModifiedDate.getDate()
          };
        }
        this.operationModalRef(component, operation);
      });
    } else {
      return this.operationModalRef(component, new Operation());
    }
  }

  operationModalRef(component: Component, operation: Operation): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.operation = operation;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'operation', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'operation', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
