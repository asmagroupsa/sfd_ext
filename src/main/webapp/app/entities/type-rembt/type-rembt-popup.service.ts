import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TypeRembt } from './type-rembt.model';
import { TypeRembtService } from './type-rembt.service';

@Injectable()
export class TypeRembtPopupService {
  private isOpen = false;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private typeRembtService: TypeRembtService
  ) {}

  open(component: Component, id?: number | any): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    if (id) {
      this.typeRembtService.find(id).subscribe(typeRembt => {
        this.typeRembtModalRef(component, typeRembt);
      });
    } else {
      return this.typeRembtModalRef(component, new TypeRembt());
    }
  }

  typeRembtModalRef(component: Component, typeRembt: TypeRembt): NgbModalRef {
    const modalRef = this.modalService.open(component, { keyboard:false,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.typeRembt = typeRembt;
    modalRef.result.then(
      result => {
        this.router.navigate(
          ['/entity', 'type-rembt', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      },
      reason => {
        this.router.navigate(
          ['/entity', 'type-rembt', { outlets: { popup: null } }],
          { replaceUrl: true }
        );
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
