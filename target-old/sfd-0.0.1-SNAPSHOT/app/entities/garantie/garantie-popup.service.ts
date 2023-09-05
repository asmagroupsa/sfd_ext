import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Garantie } from './garantie.model';
import { GarantieService } from './garantie.service';

@Injectable()
export class GarantiePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private garantieService: GarantieService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.garantieService.find(id).subscribe(garantie => {
        if (garantie.createdDate) {
          garantie.createdDate = {
            year: garantie.createdDate.getFullYear(),
            month: garantie.createdDate.getMonth() + 1,
            day: garantie.createdDate.getDate()
          };
        }
        if (garantie.lastModifiedDate) {
          garantie.lastModifiedDate = {
            year: garantie.lastModifiedDate.getFullYear(),
            month: garantie.lastModifiedDate.getMonth() + 1,
            day: garantie.lastModifiedDate.getDate()
          };
        }
        this.garantieModalRef(component, garantie);
      });
    } else {
      return this.garantieModalRef(component, new Garantie());
    }
  }

  garantieModalRef(component: Component, garantie: Garantie): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.garantie = garantie;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
