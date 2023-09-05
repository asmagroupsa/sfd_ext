import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranchePenal } from './tranche-penal.model';
import { TranchePenalService } from './tranche-penal.service';

@Injectable()
export class TranchePenalPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private tranchePenalService: TranchePenalService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.tranchePenalService.find(id).subscribe(tranchePenal => {
        if (tranchePenal.createdDate) {
          tranchePenal.createdDate = {
            year: tranchePenal.createdDate.getFullYear(),
            month: tranchePenal.createdDate.getMonth() + 1,
            day: tranchePenal.createdDate.getDate()
          };
        }
        if (tranchePenal.lastModifiedDate) {
          tranchePenal.lastModifiedDate = {
            year: tranchePenal.lastModifiedDate.getFullYear(),
            month: tranchePenal.lastModifiedDate.getMonth() + 1,
            day: tranchePenal.lastModifiedDate.getDate()
          };
        }
        this.tranchePenalModalRef(component, tranchePenal);
      });
    } else {
      return this.tranchePenalModalRef(component, new TranchePenal());
    }
  }

  tranchePenalModalRef(
    component: Component,
    tranchePenal: TranchePenal
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.tranchePenal = tranchePenal;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'tranche-penal', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'tranche-penal', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
