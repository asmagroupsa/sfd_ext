import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompensationType } from './compensation-type.model';
import { CompensationTypeService } from './compensation-type.service';

@Injectable()
export class CompensationTypePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private compensationTypeService: CompensationTypeService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.compensationTypeService.find(id).subscribe(compensationType => {
        this.compensationTypeModalRef(component, compensationType);
      });
    } else {
      return this.compensationTypeModalRef(component, new CompensationType());
    }
  }

  compensationTypeModalRef(
    component: Component,
    compensationType: CompensationType
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.compensationType = compensationType;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'compensation-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'compensation-type', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
