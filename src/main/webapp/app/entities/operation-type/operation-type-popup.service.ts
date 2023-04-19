import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OperationType } from './operation-type.model';
import { OperationTypeService } from './operation-type.service';

@Injectable()
export class OperationTypePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private operationTypeService: OperationTypeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.operationTypeService.find(id).subscribe(operationType => {
        this.operationTypeModalRef(component, operationType);
      });
    } else {
      return this.operationTypeModalRef(component, new OperationType());
    }
  }

  operationTypeModalRef(
    component: Component,
    operationType: OperationType
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.operationType = operationType;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'operation-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'operation-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
