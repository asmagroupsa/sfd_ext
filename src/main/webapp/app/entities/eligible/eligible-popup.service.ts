import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Eligible } from './eligible.model';
import { EligibleService } from './eligible.service';

@Injectable()
export class EligiblePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private eligibleService: EligibleService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.eligibleService.find(id).subscribe(eligible => {
        if (eligible.createdDate) {
          eligible.createdDate = {
            year: eligible.createdDate.getFullYear(),
            month: eligible.createdDate.getMonth() + 1,
            day: eligible.createdDate.getDate()
          };
        }
        if (eligible.lastModifiedDate) {
          eligible.lastModifiedDate = {
            year: eligible.lastModifiedDate.getFullYear(),
            month: eligible.lastModifiedDate.getMonth() + 1,
            day: eligible.lastModifiedDate.getDate()
          };
        }
        this.eligibleModalRef(component, eligible);
      });
    } else {
      return this.eligibleModalRef(component, new Eligible());
    }
  }

  eligibleModalRef(component: Component, eligible: Eligible): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.eligible = eligible;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'eligible', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'eligible', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
