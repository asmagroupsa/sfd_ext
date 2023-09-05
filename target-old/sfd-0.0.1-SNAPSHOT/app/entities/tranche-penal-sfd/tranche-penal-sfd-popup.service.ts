import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranchePenalSFD } from './tranche-penal-sfd.model';
import { TranchePenalSFDService } from './tranche-penal-sfd.service';

@Injectable()
export class TranchePenalSFDPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tranchePenalSFDService: TranchePenalSFDService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tranchePenalSFDService.find(id).subscribe(tranchePenalSFD => {
        if (tranchePenalSFD.createdDate) {
          tranchePenalSFD.createdDate = {
            year: tranchePenalSFD.createdDate.getFullYear(),
            month: tranchePenalSFD.createdDate.getMonth() + 1,
            day: tranchePenalSFD.createdDate.getDate()
          };
        }
        if (tranchePenalSFD.lastModifiedDate) {
          tranchePenalSFD.lastModifiedDate = {
            year: tranchePenalSFD.lastModifiedDate.getFullYear(),
            month: tranchePenalSFD.lastModifiedDate.getMonth() + 1,
            day: tranchePenalSFD.lastModifiedDate.getDate()
          };
        }
        this.tranchePenalSFDModalRef(component, tranchePenalSFD);
      });
    } else {
      return this.tranchePenalSFDModalRef(component, new TranchePenalSFD());
    }
  }

  tranchePenalSFDModalRef(
    component: Component,
    tranchePenalSFD: TranchePenalSFD
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.tranchePenalSFD = tranchePenalSFD;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'tranche-penal-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'tranche-penal-sfd', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
