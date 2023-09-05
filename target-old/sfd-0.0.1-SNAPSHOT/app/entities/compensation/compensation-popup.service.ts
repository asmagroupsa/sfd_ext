import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Compensation } from './compensation.model';
import { CompensationService } from './compensation.service';

@Injectable()
export class CompensationPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private compensationService: CompensationService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.compensationService.findOrdreVirement(id).subscribe(compensation => {
        if (compensation.createdDate) {
          compensation.createdDate = {
            year: compensation.createdDate.getFullYear(),
            month: compensation.createdDate.getMonth() + 1,
            day: compensation.createdDate.getDate()
          };
        }
        if (compensation.lastModifiedDate) {
          compensation.lastModifiedDate = {
            year: compensation.lastModifiedDate.getFullYear(),
            month: compensation.lastModifiedDate.getMonth() + 1,
            day: compensation.lastModifiedDate.getDate()
          };
        }
        this.compensationModalRef(component, compensation);
      });
    } else {
      return this.compensationModalRef(component, new Compensation());
    }
  }

  compensationModalRef(
    component: Component,
    compensation: Compensation
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.compensation = compensation;
    modalRef.result.then(
      (result) => {
        this.router.navigate( 
          ['/entity', 'compensation', { outlets: { popup: null } }],
          { replaceUrl: true }
        ).then((res)=>
          this.router.navigate(result)
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'compensation', { outlets: { popup: null } }],
          { replaceUrl: true }
        )
        this.isOpen = false;
      });
    return modalRef;
  }
}
