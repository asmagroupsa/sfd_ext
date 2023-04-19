import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Conditions } from './conditions.model';
import { ConditionsService } from './conditions.service';

@Injectable()
export class ConditionsPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private conditionsService: ConditionsService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.conditionsService.find(id).subscribe(conditions => {
        if (conditions.createdDate) {
          conditions.createdDate = {
            year: conditions.createdDate.getFullYear(),
            month: conditions.createdDate.getMonth() + 1,
            day: conditions.createdDate.getDate()
          };
        }
        if (conditions.lastModifiedDate) {
          conditions.lastModifiedDate = {
            year: conditions.lastModifiedDate.getFullYear(),
            month: conditions.lastModifiedDate.getMonth() + 1,
            day: conditions.lastModifiedDate.getDate()
          };
        }
        this.conditionsModalRef(component, conditions);
      });
    } else {
      return this.conditionsModalRef(component, new Conditions());
    }
  }

  conditionsModalRef(
    component: Component,
    conditions: Conditions
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.conditions = conditions;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'conditions', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'conditions', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
