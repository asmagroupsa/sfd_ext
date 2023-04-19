import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RembtPenal } from './rembt-penal.model';
import { RembtPenalService } from './rembt-penal.service';

@Injectable()
export class RembtPenalPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private rembtPenalService: RembtPenalService
  ) { }

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.rembtPenalService.find(id).subscribe(rembtPenal => {
        if (rembtPenal.rembPenalDate) {
          rembtPenal.rembPenalDate = {
            year: rembtPenal.rembPenalDate.getFullYear(),
            month: rembtPenal.rembPenalDate.getMonth() + 1,
            day: rembtPenal.rembPenalDate.getDate()
          };
        }
        if (rembtPenal.createdDate) {
          rembtPenal.createdDate = {
            year: rembtPenal.createdDate.getFullYear(),
            month: rembtPenal.createdDate.getMonth() + 1,
            day: rembtPenal.createdDate.getDate()
          };
        }
        if (rembtPenal.lastModifiedDate) {
          rembtPenal.lastModifiedDate = {
            year: rembtPenal.lastModifiedDate.getFullYear(),
            month: rembtPenal.lastModifiedDate.getMonth() + 1,
            day: rembtPenal.lastModifiedDate.getDate()
          };
        }
        this.rembtPenalModalRef(component, rembtPenal);
      });
    } else {
      return this.rembtPenalModalRef(component, new RembtPenal());
    }
  }

  rembtPenalModalRef(
    component: Component,
    rembtPenal: RembtPenal
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, {
      keyboard: false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.rembtPenal = rembtPenal;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'rembt-penal', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'rembt-penal', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
