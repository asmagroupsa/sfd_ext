import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeGarantie } from './type-garantie.model';
import { TypeGarantieService } from './type-garantie.service';

@Injectable()
export class TypeGarantiePopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typeGarantieService: TypeGarantieService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.typeGarantieService.find(id).subscribe(typeGarantie => {
        this.typeGarantieModalRef(component, typeGarantie);
      });
    } else {
      return this.typeGarantieModalRef(component, new TypeGarantie());
    }
  }

  typeGarantieModalRef(
    component: Component,
    typeGarantie: TypeGarantie
  ): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typeGarantie = typeGarantie;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'type-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-garantie', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
