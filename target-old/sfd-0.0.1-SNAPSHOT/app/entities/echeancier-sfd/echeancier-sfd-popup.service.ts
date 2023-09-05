import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EcheancierSFD } from './echeancier-sfd.model';
import { EcheancierSFDService } from './echeancier-sfd.service';

@Injectable()
export class EcheancierSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private echeancierSFDService: EcheancierSFDService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.echeancierSFDService.find(id).subscribe(echeancierSFD => {
        if (echeancierSFD.startDate) {
          echeancierSFD.startDate = {
            year: echeancierSFD.startDate.getFullYear(),
            month: echeancierSFD.startDate.getMonth() + 1,
            day: echeancierSFD.startDate.getDate()
          };
        }
        if (echeancierSFD.createdDate) {
          echeancierSFD.createdDate = {
            year: echeancierSFD.createdDate.getFullYear(),
            month: echeancierSFD.createdDate.getMonth() + 1,
            day: echeancierSFD.createdDate.getDate()
          };
        }
        if (echeancierSFD.lastModifiedDate) {
          echeancierSFD.lastModifiedDate = {
            year: echeancierSFD.lastModifiedDate.getFullYear(),
            month: echeancierSFD.lastModifiedDate.getMonth() + 1,
            day: echeancierSFD.lastModifiedDate.getDate()
          };
        }
        this.echeancierSFDModalRef(component, echeancierSFD);
      });
    } else {
      return this.echeancierSFDModalRef(component, new EcheancierSFD());
    }
  }

  echeancierSFDModalRef(
    component: Component,
    echeancierSFD: EcheancierSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.echeancierSFD = echeancierSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'echeancier-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'echeancier-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
