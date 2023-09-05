import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Periodicity } from './periodicity.model';
import { PeriodicityService } from './periodicity.service';

@Injectable()
export class PeriodicityPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private periodicityService: PeriodicityService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.periodicityService.find(id).subscribe(periodicity => {
        this.periodicityModalRef(component, periodicity);
      });
    } else {
      return this.periodicityModalRef(component, new Periodicity());
    }
  }

  periodicityModalRef(
    component: Component,
    periodicity: Periodicity
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.periodicity = periodicity;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'periodicity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'periodicity', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
