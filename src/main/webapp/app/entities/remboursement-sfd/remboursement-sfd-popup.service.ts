import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RemboursementSFD } from './remboursement-sfd.model';
import { RemboursementSFDService } from './remboursement-sfd.service';

@Injectable()
export class RemboursementSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private remboursementSFDService: RemboursementSFDService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.remboursementSFDService.find(id).subscribe(remboursementSFD => {
        if (remboursementSFD.rembDate) {
          remboursementSFD.rembDate = {
            year: remboursementSFD.rembDate.getFullYear(),
            month: remboursementSFD.rembDate.getMonth() + 1,
            day: remboursementSFD.rembDate.getDate()
          };
        }
        if (remboursementSFD.createdDate) {
          remboursementSFD.createdDate = {
            year: remboursementSFD.createdDate.getFullYear(),
            month: remboursementSFD.createdDate.getMonth() + 1,
            day: remboursementSFD.createdDate.getDate()
          };
        }
        if (remboursementSFD.lastModifiedDate) {
          remboursementSFD.lastModifiedDate = {
            year: remboursementSFD.lastModifiedDate.getFullYear(),
            month: remboursementSFD.lastModifiedDate.getMonth() + 1,
            day: remboursementSFD.lastModifiedDate.getDate()
          };
        }
        this.remboursementSFDModalRef(component, remboursementSFD);
      });
    } else {
      return this.remboursementSFDModalRef(component, new RemboursementSFD());
    }
  }

  remboursementSFDModalRef(
    component: Component,
    remboursementSFD: RemboursementSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.remboursementSFD = remboursementSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'remboursement-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'remboursement-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
