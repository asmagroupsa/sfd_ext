import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RembtPenalSFD } from './rembt-penal-sfd.model';
import { RembtPenalSFDService } from './rembt-penal-sfd.service';

@Injectable()
export class RembtPenalSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private rembtPenalSFDService: RembtPenalSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.rembtPenalSFDService.find(id).subscribe(rembtPenalSFD => {
        if (rembtPenalSFD.rembPenalDate) {
          rembtPenalSFD.rembPenalDate = {
            year: rembtPenalSFD.rembPenalDate.getFullYear(),
            month: rembtPenalSFD.rembPenalDate.getMonth() + 1,
            day: rembtPenalSFD.rembPenalDate.getDate()
          };
        }
        if (rembtPenalSFD.createdDate) {
          rembtPenalSFD.createdDate = {
            year: rembtPenalSFD.createdDate.getFullYear(),
            month: rembtPenalSFD.createdDate.getMonth() + 1,
            day: rembtPenalSFD.createdDate.getDate()
          };
        }
        if (rembtPenalSFD.lastModifiedDate) {
          rembtPenalSFD.lastModifiedDate = {
            year: rembtPenalSFD.lastModifiedDate.getFullYear(),
            month: rembtPenalSFD.lastModifiedDate.getMonth() + 1,
            day: rembtPenalSFD.lastModifiedDate.getDate()
          };
        }
        this.rembtPenalSFDModalRef(component, rembtPenalSFD);
      });
    } else {
      return this.rembtPenalSFDModalRef(component, new RembtPenalSFD());
    }
  }

  rembtPenalSFDModalRef(
    component: Component,
    rembtPenalSFD: RembtPenalSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.rembtPenalSFD = rembtPenalSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'rembt-penal-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'rembt-penal-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
