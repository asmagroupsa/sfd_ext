import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Rembt } from './rembt.model';
import { RembtService } from './rembt.service';

@Injectable()
export class RembtPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private rembtService: RembtService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.rembtService.find(id).subscribe(rembt => {
        if (rembt.rembDate) {
          rembt.rembDate = {
            year: rembt.rembDate.getFullYear(),
            month: rembt.rembDate.getMonth() + 1,
            day: rembt.rembDate.getDate()
          };
        }
        if (rembt.createdDate) {
          rembt.createdDate = {
            year: rembt.createdDate.getFullYear(),
            month: rembt.createdDate.getMonth() + 1,
            day: rembt.createdDate.getDate()
          };
        }
        if (rembt.lastModifiedDate) {
          rembt.lastModifiedDate = {
            year: rembt.lastModifiedDate.getFullYear(),
            month: rembt.lastModifiedDate.getMonth() + 1,
            day: rembt.lastModifiedDate.getDate()
          };
        }
        this.rembtModalRef(component, rembt);
      });
    } else {
      return this.rembtModalRef(component, new Rembt());
    }
  }

  rembtModalRef(component: Component, rembt: Rembt): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.rembt = rembt;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'rembt', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'rembt', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
