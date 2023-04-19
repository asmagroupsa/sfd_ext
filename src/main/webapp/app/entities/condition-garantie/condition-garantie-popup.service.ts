import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConditionGarantie } from './condition-garantie.model';
import { ConditionGarantieService } from './condition-garantie.service';

@Injectable()
export class ConditionGarantiePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private conditionGarantieService: ConditionGarantieService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.conditionGarantieService.find(id).subscribe(conditionGarantie => {
        if (conditionGarantie.createdDate) {
          conditionGarantie.createdDate = {
            year: conditionGarantie.createdDate.getFullYear(),
            month: conditionGarantie.createdDate.getMonth() + 1,
            day: conditionGarantie.createdDate.getDate()
          };
        }
        if (conditionGarantie.lastModifiedDate) {
          conditionGarantie.lastModifiedDate = {
            year: conditionGarantie.lastModifiedDate.getFullYear(),
            month: conditionGarantie.lastModifiedDate.getMonth() + 1,
            day: conditionGarantie.lastModifiedDate.getDate()
          };
        }
        this.conditionGarantieModalRef(component, conditionGarantie);
      });
    } else {
      return this.conditionGarantieModalRef(component, new ConditionGarantie());
    }
  }

  conditionGarantieModalRef(
    component: Component,
    conditionGarantie: ConditionGarantie
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.conditionGarantie = conditionGarantie;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'condition-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'condition-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
