import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConditionAcces } from './condition-acces.model';
import { ConditionAccesService } from './condition-acces.service';

@Injectable()
export class ConditionAccesPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private conditionAccesService: ConditionAccesService
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
        this.conditionAccesService.find(id).subscribe(conditionAcces => {
          this.ngbModalRef = this.conditionAccesModalRef(
            component,
            conditionAcces
          );
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.conditionAccesModalRef(
            component,
            new ConditionAcces()
          );
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  conditionAccesModalRef(
    component: Component,
    conditionAcces: ConditionAcces
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.conditionAcces = conditionAcces;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'condition-acces', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'condition-acces', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
